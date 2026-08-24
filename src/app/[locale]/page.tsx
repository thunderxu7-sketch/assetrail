import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Braces,
  CheckCircle2,
  Gauge,
  Network,
  Radar,
  ShieldCheck,
} from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import { RouteModeBadge } from "@/components/route-mode-badge";
import { StatusPill } from "@/components/status-pill";
import { getAssetCatalog } from "@/lib/asset-data";
import { localizedPath, translate, translateRailTime } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

const routeModes = [
  {
    path: "/assets",
    mode: "SSG + cache tag",
    title: "Asset policy catalog",
    copy: "Stable policy data is rendered ahead of demand and revalidated by an explicit server-side control plane.",
    tone: "mint" as const,
  },
  {
    path: "/assets/usdt",
    mode: "ISR + PPR",
    title: "Network-aware asset detail",
    copy: "Popular rails are prebuilt while uncached policy details stream into a reusable static shell.",
    tone: "cyan" as const,
  },
  {
    path: "/transfers/wd_demo_live",
    mode: "SSR + polling",
    title: "Personal transfer status",
    copy: "Request-scoped data stays server rendered; a small client island progressively reconciles status.",
    tone: "orange" as const,
  },
  {
    path: "/ops",
    mode: "Streaming",
    title: "Operational command view",
    copy: "Independent boundaries reveal availability and incident signals without blocking the entire page.",
    tone: "violet" as const,
  },
];

export default async function Home() {
  const locale = await getLocale();
  const t = (source: string, values: Record<string, string | number> = {}) => translate(locale, source, values);
  const assets = await getAssetCatalog();
  const networks = assets.flatMap((asset) => asset.networks);
  const healthyNetworks = networks.filter((network) => network.status === "healthy").length;

  return (
    <>
      <section className="hero container">
        <div className="hero__signal" aria-label={t("System status")}>
          <span className="live-dot" /> {t("All demo services operational")}
          <span className="hero__signal-divider" /> {t("Updated from cached policy data")}
        </div>
        <div className="hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">{t("Next.js 16 reference architecture")}</p>
            <h1>
              {locale === "zh" ? (
                <>
                  <span className="hero-title-primary">
                    <span className="hero-title-chunk">{t("Move digital assets")}</span>
                    <span className="hero-title-chunk">{t("with")}</span>
                  </span>
                  <span className="hero-title-accent">
                    <span className="hero-title-chunk">{t("visible")}</span>
                    <span className="hero-title-chunk">{t("guarantees.")}</span>
                  </span>
                </>
              ) : (
                <>{t("Move digital assets with")} <span>{t("visible guarantees.")}</span></>
              )}
            </h1>
            <p className="hero__lede">
              {t("A production-minded deposit and withdrawal lab that turns rendering strategy, policy validation, resilience, security, and Core Web Vitals into observable product behavior.")}
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" href={localizedPath(locale, "/transfer")}>
                {t("Run a simulated transfer")} <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link className="button button--secondary" href={localizedPath(locale, "/architecture")}>
                {t("Explore the architecture")}
              </Link>
            </div>
            <div className="hero__proof">
              <span><CheckCircle2 size={15} /> {t("No wallet connection")}</span>
              <span><CheckCircle2 size={15} /> {t("No real funds")}</span>
              <span><CheckCircle2 size={15} /> {t("Open-source test suite")}</span>
            </div>
          </div>
          <div className="rail-visual" aria-label={t("Transfer pipeline visualization")}>
            <div className="rail-visual__header">
              <span>{t("WITHDRAWAL")} / USDT</span>
              <StatusPill locale={locale} status="confirming" />
            </div>
            <div className="rail-visual__amount">
              <span>{t("Amount")}</span>
              <strong>2,500.00 <small>USDT</small></strong>
              <p>TRON · TRC20 · {t("{count} confirmations required", { count: 19 })}</p>
            </div>
            <div className="rail-steps">
              <div className="rail-step rail-step--done"><span>01</span><strong>{t("Validated")}</strong><small>0.2s</small></div>
              <div className="rail-step rail-step--done"><span>02</span><strong>{t("Policy review")}</strong><small>1.4s</small></div>
              <div className="rail-step rail-step--active"><span>03</span><strong>{t("Confirming")}</strong><small>12 / 19</small></div>
              <div className="rail-step"><span>04</span><strong>{t("Reconciled")}</strong><small>{t("pending")}</small></div>
            </div>
            <div className="rail-visual__footer">
              <span>{t("Idempotency protected")}</span>
              <code>wd_demo_live</code>
            </div>
          </div>
        </div>
      </section>

      <section className="metrics-band">
        <div className="container metrics-grid">
          <MetricCard label={t("Network availability")} value={`${healthyNetworks}/${networks.length}`} detail={t("healthy rails right now")} icon={Network} />
          <MetricCard label={t("Policy coverage")} value="100%" detail={t("server + client validation parity")} icon={ShieldCheck} tone="cyan" />
          <MetricCard label={t("Duplicate execution")} value="0" detail={t("idempotent request contract")} icon={Braces} tone="orange" />
          <MetricCard label={t("CWV budget")} value={t("Good")} detail={t("LCP · INP · CLS thresholds")} icon={Gauge} tone="violet" />
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t("One product · deliberate rendering")}</p>
            <h2>{t("Rendering is an architecture decision, not a checkbox.")}</h2>
          </div>
          <Link className="text-link" href={localizedPath(locale, "/architecture")}>{t("See decision record")} <ArrowRight size={15} /></Link>
        </div>
        <div className="route-grid">
          {routeModes.map((route) => (
            <Link className="route-card" href={localizedPath(locale, route.path)} key={route.path}>
              <RouteModeBadge mode={route.mode} tone={route.tone} />
              <h3>{t(route.title)}</h3>
              <p>{t(route.copy)}</p>
              <span className="route-card__path">{route.path} <ArrowRight size={15} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container split-showcase">
        <div className="operational-story">
          <p className="eyebrow">{t("Operational by design")}</p>
          <h2>{t("The unhappy path is part of the interface.")}</h2>
          <p>
            {t("Maintenance windows, invalid destination tags, risky amounts, duplicate submissions, and delayed confirmations are first-class states—not generic error toasts.")}
          </p>
          <ul className="feature-list">
            <li><ShieldCheck /> {t("Layered input and origin controls")}</li>
            <li><Radar /> {t("Deterministic risk and hold simulation")}</li>
            <li><Activity /> {t("Reconciliation timeline with explicit states")}</li>
          </ul>
          <Link className="button button--secondary" href={localizedPath(locale, "/ops")}>{t("Open operations view")}</Link>
        </div>
        <div className="incident-panel">
          <div className="panel-header">
            <div><span className="panel-kicker">{t("LIVE POLICY FEED")}</span><h3>{t("Rail availability")}</h3></div>
            <span className="pulse-label"><span /> {t("observing")}</span>
          </div>
          {networks.slice(0, 6).map((network, index) => (
            <div className="incident-row" key={`${network.name}-${network.chain}-${index}`}>
              <span className="network-monogram">{network.name.slice(0, 2).toUpperCase()}</span>
              <span><strong>{network.name}</strong><small>{network.chain} · {translateRailTime(locale, network.estimatedMinutes)}</small></span>
              <StatusPill locale={locale} status={network.status} />
            </div>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <div>
            <p className="eyebrow">{t("Trace the whole delivery")}</p>
            <h2>{t("From product constraint to production signal.")}</h2>
          </div>
          <div className="cta-band__actions">
            <Link className="button button--primary" href={localizedPath(locale, "/performance")}>{t("Inspect Web Vitals")}</Link>
            <a className="button button--secondary" href="https://github.com/thunderxu7-sketch/assetrail" target="_blank" rel="noreferrer">{t("Read the source")}</a>
          </div>
        </div>
      </section>
    </>
  );
}
