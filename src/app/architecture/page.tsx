import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, Boxes, Braces, Database, Eye, Gauge, KeyRound, Server, ShieldCheck } from "lucide-react";

import { PageHeading } from "@/components/page-heading";
import { RouteModeBadge } from "@/components/route-mode-badge";

export const metadata: Metadata = { title: "Architecture" };

const decisions = [
  { route: "/assets", mode: "SSG", freshness: "Explicit tag", reason: "High-read, low-churn policy catalog", risk: "Stale rail state", mitigation: "Incident-triggered revalidation" },
  { route: "/assets/[symbol]", mode: "ISR + PPR", freshness: "15 minutes", reason: "Reusable shell with evolving network rules", risk: "Partial cache drift", mitigation: "Asset-scoped cache tags" },
  { route: "/transfers/[id]", mode: "SSR", freshness: "No store", reason: "Personal, fast-changing transfer state", risk: "Server load", mitigation: "Small response + client reconciliation" },
  { route: "/ops", mode: "Streaming", freshness: "Request time", reason: "Independent operational signals", risk: "Slow dependency", mitigation: "Per-panel Suspense boundaries" },
];

export default function ArchitecturePage() {
  return (
    <div className="container page-stack">
      <PageHeading
        eyebrow="Interview-ready decision record"
        title="Architecture with explicit trade-offs"
        description="The repository connects product requirements to rendering, trust boundaries, performance budgets, observability, tests, and delivery controls."
        aside={<RouteModeBadge mode="Static documentation" tone="cyan" />}
      />

      <section className="architecture-map section-card">
        <div className="architecture-layer architecture-layer--client">
          <span className="architecture-layer__title"><Eye /> Browser</span>
          <div><span>Static shell</span><span>React client islands</span><span>Web Vitals</span></div>
        </div>
        <span className="architecture-arrow">↓ HTTPS · CSP · SameSite</span>
        <div className="architecture-layer architecture-layer--app">
          <span className="architecture-layer__title"><Boxes /> Next.js App Router</span>
          <div><span>RSC + Cache Components</span><span>Route Handlers</span><span>Suspense streaming</span></div>
        </div>
        <span className="architecture-arrow">↓ validated contracts · tagged reads</span>
        <div className="architecture-layer architecture-layer--domain">
          <span className="architecture-layer__title"><Braces /> Domain boundary</span>
          <div><span>Zod policies</span><span>Idempotency</span><span>Status machine</span><span>HMAC cookie</span></div>
        </div>
        <span className="architecture-arrow">↓ simulated adapters</span>
        <div className="architecture-layer architecture-layer--data">
          <span className="architecture-layer__title"><Database /> Deterministic fixtures</span>
          <div><span>Asset policies</span><span>Rail health</span><span>Reconciliation batches</span></div>
        </div>
      </section>

      <section className="section-card">
        <div className="panel-header"><div><span className="panel-kicker">RENDERING ADR</span><h2>Route-by-route strategy</h2></div><span className="policy-version">ADR-001</span></div>
        <div className="decision-table-wrap">
          <table className="decision-table">
            <thead><tr><th>Route</th><th>Mode</th><th>Freshness</th><th>Why</th><th>Risk → mitigation</th></tr></thead>
            <tbody>{decisions.map((decision) => <tr key={decision.route}><td><code>{decision.route}</code></td><td><strong>{decision.mode}</strong></td><td>{decision.freshness}</td><td>{decision.reason}</td><td><span>{decision.risk}</span><ArrowRight size={13} />{decision.mitigation}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="architecture-cards">
        <article><ShieldCheck /><span className="panel-kicker">TRUST BOUNDARIES</span><h3>Defense in layers</h3><p>Same-origin enforcement, bounded JSON, schema validation, policy checks, HttpOnly signed cookies, strict security headers, and no secret-bearing client code.</p><Link className="text-link" href="https://github.com/thunderxu7-sketch/assetrail/blob/main/docs/THREAT_MODEL.md">Threat model <ArrowRight size={14} /></Link></article>
        <article><Gauge /><span className="panel-kicker">PERFORMANCE</span><h3>Budgets over anecdotes</h3><p>Good-threshold budgets for LCP, INP, and CLS; local field telemetry; route-aware bundle inspection; and stable skeleton geometry.</p><Link className="text-link" href="/performance">Runtime telemetry <ArrowRight size={14} /></Link></article>
        <article><Bot /><span className="panel-kicker">AI DELIVERY</span><h3>AI with quality gates</h3><p>AI accelerates decomposition, test matrices, and implementation. Deterministic lint, type, unit, build, accessibility, and E2E checks own the acceptance decision.</p><Link className="text-link" href="https://github.com/thunderxu7-sketch/assetrail/blob/main/docs/AI_WORKFLOW.md">Workflow <ArrowRight size={14} /></Link></article>
      </section>

      <section className="security-flow">
        <div><KeyRound /><strong>Untrusted input</strong><span>browser request</span></div><ArrowRight />
        <div><ShieldCheck /><strong>Policy gate</strong><span>origin + size + Zod</span></div><ArrowRight />
        <div><Server /><strong>Domain action</strong><span>deterministic simulation</span></div><ArrowRight />
        <div><Database /><strong>Private state</strong><span>signed HttpOnly cookie</span></div>
      </section>
    </div>
  );
}
