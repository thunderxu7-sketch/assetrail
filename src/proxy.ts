import { NextResponse, type NextRequest } from "next/server";

import { LOCALE_COOKIE, isLocale, localeFromAcceptLanguage } from "@/lib/i18n";

function preferredLocale(request: NextRequest) {
  const stored = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(stored)) return stored;

  return localeFromAcceptLanguage(request.headers.get("accept-language"));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (isLocale(firstSegment)) return NextResponse.next();

  const locale = preferredLocale(request);
  const target = request.nextUrl.clone();
  target.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(target);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|robots.txt|sitemap.xml|.*\\..*).*)"],
};
