import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";

import { AssetIcon } from "@/components/asset-icon";
import { PageHeading } from "@/components/page-heading";
import { RouteModeBadge } from "@/components/route-mode-badge";
import { AvailabilityPills, StatusPill } from "@/components/status-pill";
import { getAssetCatalog } from "@/lib/asset-data";
import { formatCurrency } from "@/lib/format";
import { localizedPath, translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: translate(locale, "Asset policies") };
}

export default async function AssetsPage() {
  const locale = await getLocale();
  const t = (source: string, values: Record<string, string | number> = {}) => translate(locale, source, values);
  const assets = await getAssetCatalog();

  return (
    <div className="container page-stack">
      <PageHeading
        eyebrow={t("Cached policy catalog")}
        title={t("Asset rails at a glance")}
        description={t("Stable policy data is rendered ahead of demand, tagged for targeted revalidation, and shared across route boundaries.")}
        aside={<RouteModeBadge mode="SSG · cacheLife(max)" />}
      />

      <div className="policy-notice">
        <RefreshCw size={17} aria-hidden="true" />
        <span><strong>{t("Explicit freshness:")}</strong> {t("catalog reads are cached indefinitely until the protected revalidation endpoint expires the asset-catalog tag.")}</span>
      </div>

      <div className="asset-table-wrap">
        <table className="asset-table">
          <thead>
            <tr><th>{t("Asset")}</th><th>{t("Reference price")}</th><th>{t("Networks")}</th><th>{t("Availability")}</th><th>{t("Status")}</th><th><span className="sr-only">{t("View")}</span></th></tr>
          </thead>
          <tbody>
            {assets.map((asset) => {
              const worstStatus = asset.networks.some((network) => network.status === "maintenance")
                ? "maintenance"
                : asset.networks.some((network) => network.status === "congested") ? "congested" : "healthy";
              return (
                <tr key={asset.symbol}>
                  <td><span className="asset-cell"><AssetIcon asset={asset} /><span><strong>{asset.symbol}</strong><small>{asset.name}</small></span></span></td>
                  <td><strong>{formatCurrency(asset.price)}</strong></td>
                  <td><span className="network-stack">{asset.networks.map((network) => <span key={network.id}>{network.chain}</span>)}</span></td>
                  <td><AvailabilityPills deposit={asset.networks.every((n) => n.depositEnabled)} withdrawal={asset.networks.every((n) => n.withdrawalEnabled)} locale={locale} /></td>
                  <td><StatusPill locale={locale} status={worstStatus} /></td>
                  <td><Link className="icon-link" href={localizedPath(locale, `/assets/${asset.symbol.toLowerCase()}`)} aria-label={t("View {asset} policy", { asset: asset.symbol })}><ArrowRight size={18} /></Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="table-caption">{t("Reference prices and availability are deterministic demo fixtures—not market data.")}</p>
    </div>
  );
}
