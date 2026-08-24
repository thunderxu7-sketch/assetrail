import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock3 } from "lucide-react";

import { OpsPanelSkeleton, RailHealthPanel, ReconciliationPanel, RiskQueuePanel } from "@/components/ops-panels";
import { PageHeading } from "@/components/page-heading";
import { RouteModeBadge } from "@/components/route-mode-badge";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: translate(locale, "Operations") };
}

export default async function OperationsPage() {
  const locale = await getLocale();
  const t = (source: string) => translate(locale, source);

  return (
    <div className="container page-stack">
      <PageHeading
        eyebrow={t("Streaming operations surface")}
        title={t("See degradation before users feel it")}
        description={t("Independent request-time panels stream into a cached shell, so one slow signal never blocks the entire control surface.")}
        aside={<RouteModeBadge mode="PPR · Suspense streaming" tone="violet" />}
      />
      <div className="ops-summary">
        <div><span className="live-dot" /><span><strong>{t("7 rails observed")}</strong><small>{t("5 healthy · 1 congested · 1 maintenance")}</small></span></div>
        <div><strong>99.97%</strong><span>{t("30d simulated availability")}</span></div>
        <div><strong>0</strong><span>{t("unreconciled critical batches")}</span></div>
      </div>
      <div className="ops-grid">
        <Suspense fallback={<OpsPanelSkeleton locale={locale} wide />}><RailHealthPanel locale={locale} /></Suspense>
        <Suspense fallback={<OpsPanelSkeleton locale={locale} />}><ReconciliationPanel locale={locale} /></Suspense>
        <Suspense fallback={<OpsPanelSkeleton locale={locale} />}><RiskQueuePanel locale={locale} /></Suspense>
      </div>
      <aside className="streaming-note">
        <Clock3 size={18} /><span><strong>{t("Streaming demonstration:")}</strong> {t("each panel has an intentional 180–320 ms server delay. The page shell and resolved panels remain independently useful.")}</span>
      </aside>
    </div>
  );
}
