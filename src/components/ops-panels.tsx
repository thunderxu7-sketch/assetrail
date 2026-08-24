import { connection } from "next/server";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { StatusPill } from "@/components/status-pill";
import { getAssetCatalog } from "@/lib/asset-data";
import { translate, translateRailTime, type Locale } from "@/lib/i18n";

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function RailHealthPanel({ locale }: { locale: Locale }) {
  await connection();
  await wait(180);
  const assets = await getAssetCatalog();
  const rails = assets.flatMap((asset) => asset.networks.map((network) => ({ ...network, asset: asset.symbol })));
  const timestamp = new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date());
  const t = (source: string) => translate(locale, source);

  return (
    <section className="ops-panel ops-panel--wide">
      <div className="panel-header"><div><span className="panel-kicker">{t("RAIL HEALTH")}</span><h2>{t("Availability matrix")}</h2></div><span className="panel-timestamp">{t("sampled")} {timestamp}</span></div>
      <div className="ops-table">
        <div className="ops-table__head"><span>{t("Rail")}</span><span>{t("Deposit")}</span><span>{t("Withdrawal")}</span><span>{t("Latency")}</span><span>{t("Status")}</span></div>
        {rails.map((rail) => (
          <div className="ops-table__row" key={`${rail.asset}-${rail.id}`}>
            <span><strong>{rail.asset}</strong><small>{rail.name} · {rail.chain}</small></span>
            <span className={rail.depositEnabled ? "signal-on" : "signal-off"}>{t(rail.depositEnabled ? "Enabled" : "Paused")}</span>
            <span className={rail.withdrawalEnabled ? "signal-on" : "signal-off"}>{t(rail.withdrawalEnabled ? "Enabled" : "Paused")}</span>
            <span>{translateRailTime(locale, rail.estimatedMinutes)}</span>
            <StatusPill locale={locale} status={rail.status} />
          </div>
        ))}
      </div>
    </section>
  );
}

export async function ReconciliationPanel({ locale }: { locale: Locale }) {
  await connection();
  await wait(320);
  const now = new Date();
  const batches = [
    { id: "rec_84f2", rail: "TRON / USDT", variance: "$0.00", state: "matched", seconds: 11 },
    { id: "rec_a19e", rail: "Arbitrum / ETH", variance: "$0.00", state: "matched", seconds: 28 },
    { id: "rec_0bc4", rail: "Ethereum / USDT", variance: "$14.20", state: "review", seconds: 47 },
  ];
  const t = (source: string, values: Record<string, string | number> = {}) => translate(locale, source, values);
  return (
    <section className="ops-panel">
      <div className="panel-header"><div><span className="panel-kicker">{t("RECONCILIATION")}</span><h2>{t("Latest batches")}</h2></div><CheckCircle2 className="panel-icon panel-icon--mint" /></div>
      <div className="reconciliation-list">
        {batches.map((batch) => (
          <div key={batch.id}>
            <span className={batch.state === "matched" ? "reconciliation-state matched" : "reconciliation-state review"} />
            <span><strong>{batch.rail}</strong><small>{batch.id} · {locale === "zh" ? `${batch.seconds} 秒前` : `${batch.seconds}s ago`}</small></span>
            <span><strong>{batch.variance}</strong><small>{t(batch.state)}</small></span>
          </div>
        ))}
      </div>
      <p className="panel-footnote">{t("Runtime sample at {time} UTC · values are deterministic fixtures.", { time: now.toISOString().slice(11, 19) })}</p>
    </section>
  );
}

export async function RiskQueuePanel({ locale }: { locale: Locale }) {
  await connection();
  await wait(240);
  const t = (source: string) => translate(locale, source);
  return (
    <section className="ops-panel">
      <div className="panel-header"><div><span className="panel-kicker">{t("RISK QUEUE")}</span><h2>{t("Manual review")}</h2></div><AlertTriangle className="panel-icon panel-icon--orange" /></div>
      <div className="risk-summary"><strong>1</strong><span>{t("active hold")}<small>{t("Threshold: 100,000 units")}</small></span></div>
      <div className="risk-record">
        <span>82</span>
        <span><strong>{t("USDT withdrawal")}</strong><small>{t("Volume rule · new destination")}</small></span>
        <em>{locale === "zh" ? "14 分钟" : "14m"}</em>
      </div>
      <div className="risk-controls"><span>{t("Auto-release")}</span><strong>{t("Disabled")}</strong><span>SLA</span><strong>{locale === "zh" ? "< 30 分钟" : "< 30 min"}</strong></div>
    </section>
  );
}

export function OpsPanelSkeleton({ locale, wide = false }: { locale: Locale; wide?: boolean }) {
  return <div className={`skeleton skeleton--ops ${wide ? "ops-panel--wide" : ""}`} aria-label={translate(locale, "Streaming operational data")} />;
}
