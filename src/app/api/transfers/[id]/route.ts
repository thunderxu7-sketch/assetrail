import { NextResponse, type NextRequest } from "next/server";

import { isLocale, translate } from "@/lib/i18n";
import { createDemoTransfer, decodeTransferCookie, progressTransfer } from "@/lib/transfers";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieRecord = decodeTransferCookie(request.cookies.get("assetrail_transfer")?.value);
  const record = cookieRecord?.id === id ? cookieRecord : createDemoTransfer(id);
  const requestedLocale = request.headers.get("x-assetrail-locale") ?? undefined;
  const locale = isLocale(requestedLocale) ? requestedLocale : "en";
  if (!record) return NextResponse.json({ error: translate(locale, "Transfer record not found.") }, { status: 404 });

  return NextResponse.json(
    { transfer: progressTransfer(record), serverTime: new Date().toISOString() },
    { headers: { "cache-control": "private, no-store", "x-content-source": cookieRecord?.id === id ? "http-only-cookie" : "demo-fixture" } },
  );
}
