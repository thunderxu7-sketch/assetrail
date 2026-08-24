import type { CSSProperties } from "react";

import type { Asset } from "@/lib/assets";

export function AssetIcon({ asset, size = "md" }: { asset: Asset; size?: "sm" | "md" | "lg" }) {
  return (
    <span className={`asset-icon asset-icon--${size}`} style={{ "--asset-accent": asset.accent } as CSSProperties}>
      {asset.symbol.slice(0, 1)}
    </span>
  );
}
