import type { Metadata } from "next";

import { PageHeading } from "@/components/page-heading";
import { PerformanceDashboard } from "@/components/performance-dashboard";
import { RouteModeBadge } from "@/components/route-mode-badge";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: translate(locale, "PERFORMANCE") };
}

export default async function PerformancePage() {
  const locale = await getLocale();
  const t = (source: string) => translate(locale, source);

  return (
    <div className="container page-stack">
      <PageHeading
        eyebrow={t("Measure the user experience")}
        title={t("Core Web Vitals are release criteria")}
        description={t("This local field dashboard captures LCP, INP, and CLS from the current browser. The same contract can feed a production analytics backend.")}
        aside={<RouteModeBadge mode={t("Client telemetry island")} tone="mint" />}
      />
      <PerformanceDashboard locale={locale} />
    </div>
  );
}
