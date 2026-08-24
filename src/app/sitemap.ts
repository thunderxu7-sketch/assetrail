import type { MetadataRoute } from "next";

import { ASSETS } from "@/lib/assets";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL
    ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
  const routes = ["", "/assets", "/transfer", "/ops", "/architecture", "/performance"];
  return [...routes, ...ASSETS.map((asset) => `/assets/${asset.symbol.toLowerCase()}`)].map((route) => ({
    url: `${base}${route}`,
    changeFrequency: route.startsWith("/assets") ? "hourly" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
