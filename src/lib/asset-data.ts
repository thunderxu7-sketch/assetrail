import { cacheLife, cacheTag } from "next/cache";

import { ASSETS, findAsset } from "@/lib/assets";

export async function getAssetCatalog() {
  "use cache";
  cacheLife("max");
  cacheTag("asset-catalog");
  return ASSETS;
}

export async function getAssetPolicy(symbol: string) {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 86_400 });
  cacheTag("asset-catalog", `asset-policy:${symbol.toLowerCase()}`);
  return findAsset(symbol) ?? null;
}
