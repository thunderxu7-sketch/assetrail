import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeading } from "@/components/page-heading";
import { RouteModeBadge } from "@/components/route-mode-badge";
import { TransferForm } from "@/components/transfer-form";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: translate(locale, "Transfer lab") };
}

export default async function TransferPage() {
  const locale = await getLocale();
  const t = (source: string) => translate(locale, source);

  return (
    <div className="container page-stack">
      <PageHeading
        eyebrow={t("Safe interaction lab")}
        title={t("Exercise the transfer contract")}
        description={t("Validate network rules, error recovery, idempotency, and progress states without connecting a wallet or touching real funds.")}
        aside={<RouteModeBadge mode="Client island · Route Handler" tone="orange" />}
      />
      <Suspense fallback={<div className="skeleton skeleton--form" />}>
        <TransferForm locale={locale} />
      </Suspense>
    </div>
  );
}
