import { z } from "zod";
import { createHmac, timingSafeEqual } from "node:crypto";

import { findAsset, findNetwork } from "@/lib/assets";

export const transferDirections = ["deposit", "withdrawal"] as const;
export const transferStatuses = [
  "created",
  "policy_review",
  "broadcasting",
  "confirming",
  "completed",
  "held",
  "failed",
] as const;

export type TransferDirection = (typeof transferDirections)[number];
export type TransferStatus = (typeof transferStatuses)[number];

export type TransferRecord = {
  id: string;
  direction: TransferDirection;
  asset: string;
  network: string;
  amount: number;
  address: string;
  memo?: string;
  status: TransferStatus;
  confirmations: number;
  requiredConfirmations: number;
  riskScore: number;
  createdAt: string;
};

export const transferInputSchema = z
  .object({
    direction: z.enum(transferDirections),
    asset: z.string().trim().min(2).max(10),
    network: z.string().trim().min(2).max(24),
    amount: z.coerce.number().positive().max(1_000_000),
    address: z.string().trim().min(8).max(128),
    memo: z.string().trim().max(64).optional(),
  })
  .superRefine((input, context) => {
    const asset = findAsset(input.asset);
    const network = findNetwork(input.asset, input.network);

    if (!asset || !network) {
      context.addIssue({ code: "custom", message: "Unsupported asset or network", path: ["network"] });
      return;
    }

    if (input.direction === "withdrawal" && !network.withdrawalEnabled) {
      context.addIssue({ code: "custom", message: "Withdrawals are paused for this network", path: ["network"] });
    }

    if (input.direction === "deposit" && !network.depositEnabled) {
      context.addIssue({ code: "custom", message: "Deposits are paused for this network", path: ["network"] });
    }

    if (input.amount < network.minWithdrawal) {
      context.addIssue({
        code: "custom",
        message: `Minimum amount is ${network.minWithdrawal} ${asset.symbol}`,
        path: ["amount"],
      });
    }

    if (!isValidAddress(input.network, input.address)) {
      context.addIssue({ code: "custom", message: "Address format does not match the selected network", path: ["address"] });
    }

    if (network.memoLabel && !input.memo) {
      context.addIssue({ code: "custom", message: `${network.memoLabel} is required`, path: ["memo"] });
    }
  });

export type TransferInput = z.input<typeof transferInputSchema>;
export type ParsedTransferInput = z.output<typeof transferInputSchema>;

export function isValidAddress(network: string, address: string) {
  const value = address.trim();
  switch (network) {
    case "tron":
      return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(value);
    case "ethereum":
    case "arbitrum":
      return /^0x[a-fA-F0-9]{40}$/.test(value);
    case "bitcoin":
      return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/i.test(value);
    case "solana":
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);
    case "xrpl":
      return /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(value);
    default:
      return false;
  }
}

function stableHash(value: string) {
  let hash = 2_166_136_261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return (hash >>> 0).toString(36).padStart(7, "0");
}

export function createTransferRecord(input: ParsedTransferInput, idempotencyKey: string, now = new Date()): TransferRecord {
  const network = findNetwork(input.asset, input.network);
  if (!network) throw new Error("Network policy not found");

  const timestamp = Math.floor(now.getTime() / 1000).toString(36);
  const fingerprint = stableHash(`${idempotencyKey}:${JSON.stringify(input)}`);
  return {
    id: `${input.direction === "withdrawal" ? "wd" : "dp"}_${timestamp}_${fingerprint}`,
    ...input,
    asset: input.asset.toUpperCase(),
    status: "created",
    confirmations: 0,
    requiredConfirmations: network.confirmations,
    riskScore: Math.min(99, Math.round(8 + Math.log10(input.amount + 1) * 9)),
    createdAt: now.toISOString(),
  };
}

export function progressTransfer(record: TransferRecord, now = new Date()): TransferRecord {
  const elapsed = Math.max(0, (now.getTime() - new Date(record.createdAt).getTime()) / 1000);
  const highRisk = record.amount >= 100_000;

  if (highRisk && elapsed >= 4) {
    return { ...record, status: "held", confirmations: 0, riskScore: Math.max(record.riskScore, 82) };
  }
  if (elapsed < 2) return { ...record, status: "created", confirmations: 0 };
  if (elapsed < 5) return { ...record, status: "policy_review", confirmations: 0 };
  if (elapsed < 8) return { ...record, status: "broadcasting", confirmations: 0 };
  if (elapsed < 14) {
    const confirmations = Math.max(1, Math.min(record.requiredConfirmations - 1, Math.floor((elapsed - 8) * 4)));
    return { ...record, status: "confirming", confirmations };
  }
  return { ...record, status: "completed", confirmations: record.requiredConfirmations };
}

export const STATUS_COPY: Record<TransferStatus, { label: string; detail: string }> = {
  created: { label: "Request created", detail: "Input accepted and protected by an idempotency key." },
  policy_review: { label: "Policy review", detail: "Network availability, limits, address and risk rules are being evaluated." },
  broadcasting: { label: "Broadcasting", detail: "A signed mock transaction is being submitted to the selected network." },
  confirming: { label: "Confirming", detail: "The network has accepted the transaction; confirmations are accumulating." },
  completed: { label: "Completed", detail: "Required confirmations reached and the ledger view is reconciled." },
  held: { label: "Held for review", detail: "The amount crossed the demo risk threshold and needs manual approval." },
  failed: { label: "Failed", detail: "The operation stopped without changing any real balance." },
};

export function encodeTransferCookie(record: TransferRecord) {
  const payload = Buffer.from(JSON.stringify(record), "utf8").toString("base64url");
  const signature = signCookiePayload(payload);
  return `${payload}.${signature}`;
}

export function decodeTransferCookie(value?: string): TransferRecord | null {
  if (!value) return null;
  try {
    const [payload, signature] = value.split(".");
    if (!payload || !signature) return null;
    const expected = Buffer.from(signCookiePayload(payload));
    const received = Buffer.from(signature);
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const result = z
      .object({
        id: z.string(),
        direction: z.enum(transferDirections),
        asset: z.string(),
        network: z.string(),
        amount: z.number(),
        address: z.string(),
        memo: z.string().optional(),
        status: z.enum(transferStatuses),
        confirmations: z.number(),
        requiredConfirmations: z.number(),
        riskScore: z.number(),
        createdAt: z.string(),
      })
      .safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

function signCookiePayload(payload: string) {
  const secret = process.env.TRANSFER_COOKIE_SECRET ?? "assetrail-local-development-secret-change-before-production";
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createDemoTransfer(id: string): TransferRecord | null {
  if (id !== "wd_demo_live") return null;
  const cycleStarted = new Date(Date.now() - (Date.now() % 16_000));
  return {
    id,
    direction: "withdrawal",
    asset: "USDT",
    network: "tron",
    amount: 2_500,
    address: "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb",
    status: "created",
    confirmations: 0,
    requiredConfirmations: 19,
    riskScore: 31,
    createdAt: cycleStarted.toISOString(),
  };
}
