import { describe, expect, it } from "vitest";

import { DEFAULT_ADDRESSES } from "@/lib/assets";
import {
  createTransferRecord,
  decodeTransferCookie,
  encodeTransferCookie,
  progressTransfer,
  transferInputSchema,
} from "@/lib/transfers";

const validInput = {
  direction: "withdrawal" as const,
  asset: "USDT",
  network: "tron",
  amount: 2_500,
  address: DEFAULT_ADDRESSES.tron,
};

describe("transfer policy", () => {
  it("accepts a supported withdrawal with a valid network address", () => {
    expect(transferInputSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects withdrawals on a maintenance rail", () => {
    const result = transferInputSchema.safeParse({
      ...validInput,
      asset: "XRP",
      network: "xrpl",
      amount: 20,
      address: DEFAULT_ADDRESSES.xrpl,
      memo: "12345",
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.network).toContain("Withdrawals are paused for this network");
  });

  it("requires the network routing field when configured", () => {
    const result = transferInputSchema.safeParse({
      ...validInput,
      direction: "deposit",
      asset: "XRP",
      network: "xrpl",
      amount: 20,
      address: DEFAULT_ADDRESSES.xrpl,
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.memo).toContain("Destination tag is required");
  });

  it("rejects an address from another network", () => {
    const result = transferInputSchema.safeParse({ ...validInput, address: DEFAULT_ADDRESSES.ethereum });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.address).toBeDefined();
  });
});

describe("transfer lifecycle", () => {
  const started = new Date("2026-08-24T01:00:00.000Z");
  const record = createTransferRecord(validInput, "idem-test-001", started);

  it("creates a reproducible identifier for the same key, payload and time", () => {
    expect(createTransferRecord(validInput, "idem-test-001", started).id).toBe(record.id);
  });

  it.each([
    [1, "created"],
    [3, "policy_review"],
    [6, "broadcasting"],
    [10, "confirming"],
    [15, "completed"],
  ] as const)("moves to %s-second state %s", (seconds, expected) => {
    expect(progressTransfer(record, new Date(started.getTime() + seconds * 1_000)).status).toBe(expected);
  });

  it("holds high-value requests before broadcast", () => {
    const highValue = createTransferRecord({ ...validInput, amount: 100_000 }, "idem-high-value", started);
    const progressed = progressTransfer(highValue, new Date(started.getTime() + 5_000));
    expect(progressed.status).toBe("held");
    expect(progressed.riskScore).toBeGreaterThanOrEqual(82);
  });

  it("round-trips a signed private record and rejects tampering", () => {
    const encoded = encodeTransferCookie(record);
    expect(decodeTransferCookie(encoded)).toEqual(record);
    expect(decodeTransferCookie(`${encoded.slice(0, -1)}x`)).toBeNull();
  });
});
