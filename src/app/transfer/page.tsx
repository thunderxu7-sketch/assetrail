import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeading } from "@/components/page-heading";
import { RouteModeBadge } from "@/components/route-mode-badge";
import { TransferForm } from "@/components/transfer-form";

export const metadata: Metadata = { title: "Transfer lab" };

export default function TransferPage() {
  return (
    <div className="container page-stack">
      <PageHeading
        eyebrow="Safe interaction lab"
        title="Exercise the transfer contract"
        description="Validate network rules, error recovery, idempotency, and progress states without connecting a wallet or touching real funds."
        aside={<RouteModeBadge mode="Client island · Route Handler" tone="orange" />}
      />
      <Suspense fallback={<div className="skeleton skeleton--form" />}>
        <TransferForm />
      </Suspense>
    </div>
  );
}
