import type { Metadata } from "next";

import { PageHeading } from "@/components/page-heading";
import { PerformanceDashboard } from "@/components/performance-dashboard";
import { RouteModeBadge } from "@/components/route-mode-badge";

export const metadata: Metadata = { title: "Performance" };

export default function PerformancePage() {
  return (
    <div className="container page-stack">
      <PageHeading
        eyebrow="Measure the user experience"
        title="Core Web Vitals are release criteria"
        description="This local field dashboard captures LCP, INP, and CLS from the current browser. The same contract can feed a production analytics backend."
        aside={<RouteModeBadge mode="Client telemetry island" tone="mint" />}
      />
      <PerformanceDashboard />
    </div>
  );
}
