import type { MetadataRoute } from "next";

import { ASSETS } from "@/lib/assets";
import { LOCALES, localizedPath } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL
    ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
  const routes = ["", "/assets", "/transfer", "/ops", "/architecture", "/performance"];
  return LOCALES.flatMap((locale) =>
    [...routes, ...ASSETS.map((asset) => `/assets/${asset.symbol.toLowerCase()}`)].map((route) => ({
      url: `${base}${localizedPath(locale, route || "/")}`,
      changeFrequency: route.startsWith("/assets") ? "hourly" as const : "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
  );
}
