import { NextResponse } from "next/server";

import { isLocale, LOCALE_COOKIE } from "@/lib/i18n";
import { hasSafeJsonBody, isSameOriginRequest } from "@/lib/security";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request) || !hasSafeJsonBody(request, 128)) {
    return new NextResponse(null, { status: 400 });
  }

  const body = await request.json().catch(() => null) as { locale?: string } | null;
  if (!isLocale(body?.locale)) return new NextResponse(null, { status: 422 });

  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(LOCALE_COOKIE, body.locale, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
