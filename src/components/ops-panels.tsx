import { connection } from "next/server";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { StatusPill } from "@/components/status-pill";
import { getAssetCatalog } from "@/lib/asset-data";

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function RailHealthPanel() {
  await connection();
  await wait(180);
  const assets = await getAssetCatalog();
  const rails = assets.flatMap((asset) => asset.networks.map((network) => ({ ...network, asset: asset.symbol })));
  const timestamp = new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date());

  return (
    <section className="ops-panel ops-panel--wide">
      <div className="panel-header"><div><span className="panel-kicker">RAIL HEALTH</span><h2>Availability matrix</h2></div><span className="panel-timestamp">sampled {timestamp}</span></div>
      <div className="ops-table">
        <div className="ops-table__head"><span>Rail</span><span>Deposit</span><span>Withdrawal</span><span>Latency</span><span>Status</span></div>
        {rails.map((rail) => (
          <div className="ops-table__row" key={`${rail.asset}-${rail.id}`}>
            <span><strong>{rail.asset}</strong><small>{rail.name} · {rail.chain}</small></span>
            <span className={rail.depositEnabled ? "signal-on" : "signal-off"}>{rail.depositEnabled ? "Enabled" : "Paused"}</span>
            <span className={rail.withdrawalEnabled ? "signal-on" : "signal-off"}>{rail.withdrawalEnabled ? "Enabled" : "Paused"}</span>
            <span>{rail.estimatedMinutes}</span>
            <StatusPill status={rail.status} />
          </div>
        ))}
      </div>
    </section>
  );
}

export async function ReconciliationPanel() {
  await connection();
  await wait(320);
  const now = new Date();
  const batches = [
    { id: "rec_84f2", rail: "TRON / USDT", variance: "$0.00", state: "matched", seconds: 11 },
    { id: "rec_a19e", rail: "Arbitrum / ETH", variance: "$0.00", state: "matched", seconds: 28 },
    { id: "rec_0bc4", rail: "Ethereum / USDT", variance: "$14.20", state: "review", seconds: 47 },
  ];
  return (
    <section className="ops-panel">
      <div className="panel-header"><div><span className="panel-kicker">RECONCILIATION</span><h2>Latest batches</h2></div><CheckCircle2 className="panel-icon panel-icon--mint" /></div>
      <div className="reconciliation-list">
        {batches.map((batch) => (
          <div key={batch.id}>
            <span className={batch.state === "matched" ? "reconciliation-state matched" : "reconciliation-state review"} />
            <span><strong>{batch.rail}</strong><small>{batch.id} · {batch.seconds}s ago</small></span>
            <span><strong>{batch.variance}</strong><small>{batch.state}</small></span>
          </div>
        ))}
      </div>
      <p className="panel-footnote">Runtime sample at {now.toISOString().slice(11, 19)} UTC · values are deterministic fixtures.</p>
    </section>
  );
}

export async function RiskQueuePanel() {
  await connection();
  await wait(240);
  return (
    <section className="ops-panel">
      <div className="panel-header"><div><span className="panel-kicker">RISK QUEUE</span><h2>Manual review</h2></div><AlertTriangle className="panel-icon panel-icon--orange" /></div>
      <div className="risk-summary"><strong>1</strong><span>active hold<small>Threshold: 100,000 units</small></span></div>
      <div className="risk-record">
        <span>82</span>
        <span><strong>USDT withdrawal</strong><small>Volume rule · new destination</small></span>
        <em>14m</em>
      </div>
      <div className="risk-controls"><span>Auto-release</span><strong>Disabled</strong><span>SLA</span><strong>&lt; 30 min</strong></div>
    </section>
  );
}

export function OpsPanelSkeleton({ wide = false }: { wide?: boolean }) {
  return <div className={`skeleton skeleton--ops ${wide ? "ops-panel--wide" : ""}`} aria-label="Streaming operational data" />;
}
