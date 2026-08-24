import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, Boxes, Braces, Database, Eye, Gauge, KeyRound, Server, ShieldCheck } from "lucide-react";

import { PageHeading } from "@/components/page-heading";
import { RouteModeBadge } from "@/components/route-mode-badge";
import { localizedPath, translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: translate(locale, "Architecture") };
}

const decisions = [
  { route: "/assets", mode: "SSG", freshness: "Explicit tag", reason: "High-read, low-churn policy catalog", risk: "Stale rail state", mitigation: "Incident-triggered revalidation" },
  { route: "/assets/[symbol]", mode: "ISR + PPR", freshness: "15 minutes", reason: "Reusable shell with evolving network rules", risk: "Partial cache drift", mitigation: "Asset-scoped cache tags" },
  { route: "/transfers/[id]", mode: "SSR", freshness: "No store", reason: "Personal, fast-changing transfer state", risk: "Server load", mitigation: "Small response + client reconciliation" },
  { route: "/ops", mode: "Streaming", freshness: "Request time", reason: "Independent operational signals", risk: "Slow dependency", mitigation: "Per-panel Suspense boundaries" },
];

export default async function ArchitecturePage() {
  const locale = await getLocale();
  const t = (source: string) => translate(locale, source);

  return (
    <div className="container page-stack">
      <PageHeading
        eyebrow={t("Interview-ready decision record")}
        title={t("Architecture with explicit trade-offs")}
        description={t("The repository connects product requirements to rendering, trust boundaries, performance budgets, observability, tests, and delivery controls.")}
        aside={<RouteModeBadge mode={t("Static documentation")} tone="cyan" />}
      />

      <section className="architecture-map section-card">
        <div className="architecture-layer architecture-layer--client">
          <span className="architecture-layer__title"><Eye /> {t("Browser")}</span>
          <div><span>{t("Static shell")}</span><span>{t("React client islands")}</span><span>Web Vitals</span></div>
        </div>
        <span className="architecture-arrow">↓ HTTPS · CSP · SameSite</span>
        <div className="architecture-layer architecture-layer--app">
          <span className="architecture-layer__title"><Boxes /> Next.js App Router</span>
          <div><span>{t("RSC + Cache Components")}</span><span>{t("Route Handlers")}</span><span>{t("Suspense streaming")}</span></div>
        </div>
        <span className="architecture-arrow">↓ {t("validated contracts · tagged reads")}</span>
        <div className="architecture-layer architecture-layer--domain">
          <span className="architecture-layer__title"><Braces /> {t("Domain boundary")}</span>
          <div><span>{t("Zod policies")}</span><span>{t("Idempotency")}</span><span>{t("Status machine")}</span><span>{t("HMAC cookie")}</span></div>
        </div>
        <span className="architecture-arrow">↓ {t("simulated adapters")}</span>
        <div className="architecture-layer architecture-layer--data">
          <span className="architecture-layer__title"><Database /> {t("Deterministic fixtures")}</span>
          <div><span>{t("Asset policies")}</span><span>{t("Rail health")}</span><span>{t("Reconciliation batches")}</span></div>
        </div>
      </section>

      <section className="section-card">
        <div className="panel-header"><div><span className="panel-kicker">{t("RENDERING ADR")}</span><h2>{t("Route-by-route strategy")}</h2></div><span className="policy-version">ADR-001</span></div>
        <div className="decision-table-wrap">
          <table className="decision-table">
            <thead><tr><th>{t("Route")}</th><th>{t("Mode")}</th><th>{t("Freshness")}</th><th>{t("Why")}</th><th>{t("Risk → mitigation")}</th></tr></thead>
            <tbody>{decisions.map((decision) => <tr key={decision.route}><td><code>{decision.route}</code></td><td><strong>{decision.mode}</strong></td><td>{t(decision.freshness)}</td><td>{t(decision.reason)}</td><td><span>{t(decision.risk)}</span><ArrowRight size={13} />{t(decision.mitigation)}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="architecture-cards">
        <article><ShieldCheck /><span className="panel-kicker">{t("TRUST BOUNDARIES")}</span><h3>{t("Defense in layers")}</h3><p>{t("Same-origin enforcement, bounded JSON, schema validation, policy checks, HttpOnly signed cookies, strict security headers, and no secret-bearing client code.")}</p><Link className="text-link" href="https://github.com/thunderxu7-sketch/assetrail/blob/main/docs/THREAT_MODEL.md">{t("Threat model")} <ArrowRight size={14} /></Link></article>
        <article><Gauge /><span className="panel-kicker">{t("PERFORMANCE")}</span><h3>{t("Budgets over anecdotes")}</h3><p>{t("Good-threshold budgets for LCP, INP, and CLS; local field telemetry; route-aware bundle inspection; and stable skeleton geometry.")}</p><Link className="text-link" href={localizedPath(locale, "/performance")}>{t("Runtime telemetry")} <ArrowRight size={14} /></Link></article>
        <article><Bot /><span className="panel-kicker">{t("AI DELIVERY")}</span><h3>{t("AI with quality gates")}</h3><p>{t("AI accelerates decomposition, test matrices, and implementation. Deterministic lint, type, unit, build, accessibility, and E2E checks own the acceptance decision.")}</p><Link className="text-link" href="https://github.com/thunderxu7-sketch/assetrail/blob/main/docs/AI_WORKFLOW.md">{t("Workflow")} <ArrowRight size={14} /></Link></article>
      </section>

      <section className="security-flow">
        <div><KeyRound /><strong>{t("Untrusted input")}</strong><span>{t("browser request")}</span></div><ArrowRight />
        <div><ShieldCheck /><strong>{t("Policy gate")}</strong><span>{t("origin + size + Zod")}</span></div><ArrowRight />
        <div><Server /><strong>{t("Domain action")}</strong><span>{t("deterministic simulation")}</span></div><ArrowRight />
        <div><Database /><strong>{t("Private state")}</strong><span>{t("signed HttpOnly cookie")}</span></div>
      </section>
    </div>
  );
}
