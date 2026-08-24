"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, Copy, ExternalLink, LoaderCircle, RefreshCw } from "lucide-react";

import { StatusPill } from "@/components/status-pill";
import { findAsset, findNetwork } from "@/lib/assets";
import { formatAmount, formatCurrency, maskAddress } from "@/lib/format";
import { STATUS_COPY, type TransferRecord, type TransferStatus } from "@/lib/transfers";

const stages: TransferStatus[] = ["created", "policy_review", "broadcasting", "confirming", "completed"];

export function TransferTracker({ initialTransfer }: { initialTransfer: TransferRecord }) {
  const [transfer, setTransfer] = useState(initialTransfer);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const asset = findAsset(transfer.asset);
  const network = findNetwork(transfer.asset, transfer.network);

  async function refresh() {
    setRefreshing(true);
    try {
      const response = await fetch(`/api/transfers/${transfer.id}`, { cache: "no-store" });
      if (!response.ok) return;
      const body = await response.json() as { transfer: TransferRecord };
      setTransfer(body.transfer);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (["completed", "held", "failed"].includes(transfer.status)) return;
    const timer = window.setInterval(refresh, 1_500);
    return () => window.clearInterval(timer);
  });

  async function copyId() {
    await navigator.clipboard.writeText(transfer.id);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_500);
  }

  const activeIndex = stages.indexOf(transfer.status);
  const isTerminalException = transfer.status === "held" || transfer.status === "failed";

  return (
    <div className="tracker-layout">
      <section className="tracker-card">
        <div className="tracker-card__head">
          <div><span className="panel-kicker">TRANSFER STATE</span><h1>{STATUS_COPY[transfer.status].label}</h1><p>{STATUS_COPY[transfer.status].detail}</p></div>
          <StatusPill status={transfer.status} />
        </div>

        {isTerminalException ? (
          <div className="hold-banner"><AlertTriangle /><span><strong>Manual review boundary reached</strong><small>This deterministic demo does not automatically advance held records.</small></span></div>
        ) : null}

        <ol className="status-timeline">
          {stages.map((stage, index) => {
            const done = !isTerminalException && (index < activeIndex || transfer.status === "completed");
            const active = !isTerminalException && index === activeIndex;
            return (
              <li className={done ? "done" : active ? "active" : ""} key={stage}>
                <span className="status-timeline__marker">{done ? <Check size={14} /> : index + 1}</span>
                <span><strong>{STATUS_COPY[stage].label}</strong><small>{STATUS_COPY[stage].detail}</small></span>
                {stage === "confirming" && (active || done) ? <em>{transfer.confirmations} / {transfer.requiredConfirmations}</em> : null}
              </li>
            );
          })}
        </ol>

        <div className="tracker-actions">
          <button className="button button--secondary" disabled={refreshing} onClick={refresh} type="button">
            {refreshing ? <LoaderCircle className="spin" size={16} /> : <RefreshCw size={16} />} Refresh state
          </button>
          <span>Auto-reconciles every 1.5 seconds while active</span>
        </div>
      </section>

      <aside className="transfer-receipt">
        <div className="receipt-title"><span>SIMULATION RECEIPT</span><strong>{transfer.direction.toUpperCase()}</strong></div>
        <div className="receipt-amount"><small>Amount</small><strong>{formatAmount(transfer.amount)} <span>{transfer.asset}</span></strong><p>≈ {formatCurrency(transfer.amount * (asset?.price ?? 0))}</p></div>
        <dl>
          <div><dt>Transfer ID</dt><dd><code>{transfer.id}</code><button onClick={copyId} type="button" aria-label="Copy transfer ID">{copied ? <Check size={14} /> : <Copy size={14} />}</button></dd></div>
          <div><dt>Network</dt><dd>{network?.name ?? transfer.network} · {network?.chain}</dd></div>
          <div><dt>Destination</dt><dd><code>{maskAddress(transfer.address)}</code></dd></div>
          <div><dt>Risk score</dt><dd><span className={transfer.riskScore >= 80 ? "risk-high" : "risk-low"}>{transfer.riskScore} / 100</span></dd></div>
          <div><dt>Created</dt><dd>{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "medium", timeZone: "UTC" }).format(new Date(transfer.createdAt))} UTC</dd></div>
        </dl>
        <div className="receipt-note"><strong>No chain explorer link</strong><p>This is deliberately not a real transaction. Explorer links are never fabricated.</p></div>
        <a className="text-link" href="https://github.com/thunderxu7-sketch/assetrail/blob/main/docs/THREAT_MODEL.md" target="_blank" rel="noreferrer">Review the trust boundaries <ExternalLink size={14} /></a>
      </aside>
    </div>
  );
}
