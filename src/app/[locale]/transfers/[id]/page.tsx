import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";

import { RouteModeBadge } from "@/components/route-mode-badge";
import { TransferTracker } from "@/components/transfer-tracker";
import { localizedPath, translate, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { createDemoTransfer, decodeTransferCookie, progressTransfer } from "@/lib/transfers";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: translate(locale, "Transfer status") };
}

async function PersonalizedTransfer({ locale, params }: { locale: Locale; params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieRecord = decodeTransferCookie(cookieStore.get("assetrail_transfer")?.value);
  const record = cookieRecord?.id === id ? cookieRecord : createDemoTransfer(id);
  if (!record) notFound();
  return <TransferTracker initialTransfer={progressTransfer(record)} locale={locale} />;
}

export default async function TransferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const locale = await getLocale();
  return (
    <div className="container page-stack">
      <div className="page-topline">
        <Link className="back-link" href={localizedPath(locale, "/transfer")}><ArrowLeft size={15} /> {translate(locale, "New simulation")}</Link>
        <RouteModeBadge mode="SSR · private no-store" tone="orange" />
      </div>
      <Suspense fallback={<TransferStatusSkeleton />}>
        <PersonalizedTransfer locale={locale} params={params} />
      </Suspense>
    </div>
  );
}

function TransferStatusSkeleton() {
  return <div className="tracker-layout"><div className="skeleton skeleton--tracker" /><div className="skeleton skeleton--receipt" /></div>;
}
