import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";

import { RouteModeBadge } from "@/components/route-mode-badge";
import { TransferTracker } from "@/components/transfer-tracker";
import { createDemoTransfer, decodeTransferCookie, progressTransfer } from "@/lib/transfers";

export const metadata: Metadata = { title: "Transfer status" };

async function PersonalizedTransfer({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieRecord = decodeTransferCookie(cookieStore.get("assetrail_transfer")?.value);
  const record = cookieRecord?.id === id ? cookieRecord : createDemoTransfer(id);
  if (!record) notFound();
  return <TransferTracker initialTransfer={progressTransfer(record)} />;
}

export default function TransferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="container page-stack">
      <div className="page-topline">
        <Link className="back-link" href="/transfer"><ArrowLeft size={15} /> New simulation</Link>
        <RouteModeBadge mode="SSR · private no-store" tone="orange" />
      </div>
      <Suspense fallback={<TransferStatusSkeleton />}>
        <PersonalizedTransfer params={params} />
      </Suspense>
    </div>
  );
}

function TransferStatusSkeleton() {
  return <div className="tracker-layout"><div className="skeleton skeleton--tracker" /><div className="skeleton skeleton--receipt" /></div>;
}
