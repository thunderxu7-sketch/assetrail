import { NextResponse, type NextRequest } from "next/server";

import { hasSafeJsonBody, isSameOriginRequest } from "@/lib/security";
import { createTransferRecord, decodeTransferCookie, encodeTransferCookie, transferInputSchema } from "@/lib/transfers";

const RECORD_COOKIE = "assetrail_transfer";
const KEY_COOKIE = "assetrail_idempotency";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Cross-origin transfer requests are rejected." }, { status: 403 });
  }
  if (!hasSafeJsonBody(request)) {
    return NextResponse.json({ error: "Expected an application/json body under 4 KB." }, { status: 415 });
  }

  const idempotencyKey = request.headers.get("idempotency-key")?.trim();
  if (!idempotencyKey || idempotencyKey.length < 8 || idempotencyKey.length > 128) {
    return NextResponse.json({ error: "A valid Idempotency-Key header is required." }, { status: 400 });
  }

  const existingKey = request.cookies.get(KEY_COOKIE)?.value;
  const existingRecord = decodeTransferCookie(request.cookies.get(RECORD_COOKIE)?.value);
  if (existingKey === idempotencyKey && existingRecord) {
    return NextResponse.json({ transfer: existingRecord, replayed: true }, { headers: { "x-idempotent-replay": "true" } });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON body." }, { status: 400 });
  }

  const parsed = transferInputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Review the highlighted policy violations.", fields: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const transfer = createTransferRecord(parsed.data, idempotencyKey);
  const response = NextResponse.json({ transfer }, { status: 201 });
  const cookieOptions = { httpOnly: true, sameSite: "strict" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 };
  response.cookies.set(RECORD_COOKIE, encodeTransferCookie(transfer), cookieOptions);
  response.cookies.set(KEY_COOKIE, idempotencyKey, cookieOptions);
  response.headers.set("cache-control", "private, no-store");
  return response;
}
