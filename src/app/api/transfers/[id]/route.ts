import { NextResponse, type NextRequest } from "next/server";

import { createDemoTransfer, decodeTransferCookie, progressTransfer } from "@/lib/transfers";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieRecord = decodeTransferCookie(request.cookies.get("assetrail_transfer")?.value);
  const record = cookieRecord?.id === id ? cookieRecord : createDemoTransfer(id);
  if (!record) return NextResponse.json({ error: "Transfer record not found." }, { status: 404 });

  return NextResponse.json(
    { transfer: progressTransfer(record), serverTime: new Date().toISOString() },
    { headers: { "cache-control": "private, no-store", "x-content-source": cookieRecord?.id === id ? "http-only-cookie" : "demo-fixture" } },
  );
}
