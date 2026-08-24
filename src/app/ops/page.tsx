import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock3 } from "lucide-react";

import { OpsPanelSkeleton, RailHealthPanel, ReconciliationPanel, RiskQueuePanel } from "@/components/ops-panels";
import { PageHeading } from "@/components/page-heading";
import { RouteModeBadge } from "@/components/route-mode-badge";

export const metadata: Metadata = { title: "Operations" };

export default function OperationsPage() {
  return (
    <div className="container page-stack">
      <PageHeading
        eyebrow="Streaming operations surface"
        title="See degradation before users feel it"
        description="Independent request-time panels stream into a cached shell, so one slow signal never blocks the entire control surface."
        aside={<RouteModeBadge mode="PPR · Suspense streaming" tone="violet" />}
      />
      <div className="ops-summary">
        <div><span className="live-dot" /><span><strong>7 rails observed</strong><small>5 healthy · 1 congested · 1 maintenance</small></span></div>
        <div><strong>99.97%</strong><span>30d simulated availability</span></div>
        <div><strong>0</strong><span>unreconciled critical batches</span></div>
      </div>
      <div className="ops-grid">
        <Suspense fallback={<OpsPanelSkeleton wide />}><RailHealthPanel /></Suspense>
        <Suspense fallback={<OpsPanelSkeleton />}><ReconciliationPanel /></Suspense>
        <Suspense fallback={<OpsPanelSkeleton />}><RiskQueuePanel /></Suspense>
      </div>
      <aside className="streaming-note">
        <Clock3 size={18} /><span><strong>Streaming demonstration:</strong> each panel has an intentional 180–320 ms server delay. The page shell and resolved panels remain independently useful.</span>
      </aside>
    </div>
  );
}
