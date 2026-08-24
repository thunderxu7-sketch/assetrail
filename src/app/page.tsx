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
  const assets = await getAssetCatalog();
  const networks = assets.flatMap((asset) => asset.networks);
  const healthyNetworks = networks.filter((network) => network.status === "healthy").length;

  return (
    <>
      <section className="hero container">
        <div className="hero__signal" aria-label="System status">
          <span className="live-dot" /> All demo services operational
          <span className="hero__signal-divider" /> Updated from cached policy data
        </div>
        <div className="hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">Next.js 16 reference architecture</p>
            <h1>
              Move digital assets with <span>visible guarantees.</span>
            </h1>
            <p className="hero__lede">
              A production-minded deposit and withdrawal lab that turns rendering strategy, policy validation,
              resilience, security, and Core Web Vitals into observable product behavior.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" href="/transfer">
                Run a simulated transfer <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link className="button button--secondary" href="/architecture">
                Explore the architecture
              </Link>
            </div>
            <div className="hero__proof">
              <span><CheckCircle2 size={15} /> No wallet connection</span>
              <span><CheckCircle2 size={15} /> No real funds</span>
              <span><CheckCircle2 size={15} /> Open-source test suite</span>
            </div>
          </div>
          <div className="rail-visual" aria-label="Transfer pipeline visualization">
            <div className="rail-visual__header">
              <span>WITHDRAWAL / USDT</span>
              <StatusPill status="confirming" />
            </div>
            <div className="rail-visual__amount">
              <span>Amount</span>
              <strong>2,500.00 <small>USDT</small></strong>
              <p>TRON · TRC20 · 19 confirmations required</p>
            </div>
            <div className="rail-steps">
              <div className="rail-step rail-step--done"><span>01</span><strong>Validated</strong><small>0.2s</small></div>
              <div className="rail-step rail-step--done"><span>02</span><strong>Policy review</strong><small>1.4s</small></div>
              <div className="rail-step rail-step--active"><span>03</span><strong>Confirming</strong><small>12 / 19</small></div>
              <div className="rail-step"><span>04</span><strong>Reconciled</strong><small>pending</small></div>
            </div>
            <div className="rail-visual__footer">
              <span>Idempotency protected</span>
              <code>wd_demo_live</code>
            </div>
          </div>
        </div>
      </section>

      <section className="metrics-band">
        <div className="container metrics-grid">
          <MetricCard label="Network availability" value={`${healthyNetworks}/${networks.length}`} detail="healthy rails right now" icon={Network} />
          <MetricCard label="Policy coverage" value="100%" detail="server + client validation parity" icon={ShieldCheck} tone="cyan" />
          <MetricCard label="Duplicate execution" value="0" detail="idempotent request contract" icon={Braces} tone="orange" />
          <MetricCard label="CWV budget" value="Good" detail="LCP · INP · CLS thresholds" icon={Gauge} tone="violet" />
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">One product · deliberate rendering</p>
            <h2>Rendering is an architecture decision, not a checkbox.</h2>
          </div>
          <Link className="text-link" href="/architecture">See decision record <ArrowRight size={15} /></Link>
        </div>
        <div className="route-grid">
          {routeModes.map((route) => (
            <Link className="route-card" href={route.path} key={route.path}>
              <RouteModeBadge mode={route.mode} tone={route.tone} />
              <h3>{route.title}</h3>
              <p>{route.copy}</p>
              <span className="route-card__path">{route.path} <ArrowRight size={15} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container split-showcase">
        <div className="operational-story">
          <p className="eyebrow">Operational by design</p>
          <h2>The unhappy path is part of the interface.</h2>
          <p>
            Maintenance windows, invalid destination tags, risky amounts, duplicate submissions, and delayed
            confirmations are first-class states—not generic error toasts.
          </p>
          <ul className="feature-list">
            <li><ShieldCheck /> Layered input and origin controls</li>
            <li><Radar /> Deterministic risk and hold simulation</li>
            <li><Activity /> Reconciliation timeline with explicit states</li>
          </ul>
          <Link className="button button--secondary" href="/ops">Open operations view</Link>
        </div>
        <div className="incident-panel">
          <div className="panel-header">
            <div><span className="panel-kicker">LIVE POLICY FEED</span><h3>Rail availability</h3></div>
            <span className="pulse-label"><span /> observing</span>
          </div>
          {networks.slice(0, 6).map((network, index) => (
            <div className="incident-row" key={`${network.name}-${network.chain}-${index}`}>
              <span className="network-monogram">{network.name.slice(0, 2).toUpperCase()}</span>
              <span><strong>{network.name}</strong><small>{network.chain} · {network.estimatedMinutes}</small></span>
              <StatusPill status={network.status} />
            </div>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <div>
            <p className="eyebrow">Trace the whole delivery</p>
            <h2>From product constraint to production signal.</h2>
          </div>
          <div className="cta-band__actions">
            <Link className="button button--primary" href="/performance">Inspect Web Vitals</Link>
            <a className="button button--secondary" href="https://github.com/thunderxu7-sketch/assetrail" target="_blank" rel="noreferrer">Read the source</a>
          </div>
        </div>
      </section>
    </>
  );
}
