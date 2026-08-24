import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock3, Coins, ShieldCheck, Waypoints } from "lucide-react";

import { AssetIcon } from "@/components/asset-icon";
import { RouteModeBadge } from "@/components/route-mode-badge";
import { AvailabilityPills, StatusPill } from "@/components/status-pill";
import { getAssetPolicy } from "@/lib/asset-data";
import { ASSETS } from "@/lib/assets";
import { formatAmount, formatCurrency } from "@/lib/format";
import { localizedPath, translate, translateRailTime } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

type Props = { params: Promise<{ symbol: string }> };

export function generateStaticParams() {
  return ASSETS.slice(0, 2).map((asset) => ({ symbol: asset.symbol.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocale();
  const { symbol } = await params;
  const asset = await getAssetPolicy(symbol);
  return asset ? {
    title: translate(locale, "{asset} network policy", { asset: asset.symbol }),
    description: translate(locale, "{asset} deposit and withdrawal rail policies.", { asset: asset.symbol }),
  } : {};
}

async function AssetPolicy({ params }: Props) {
  const locale = await getLocale();
  const t = (source: string, values: Record<string, string | number> = {}) => translate(locale, source, values);
  const { symbol } = await params;
  const asset = await getAssetPolicy(symbol);
  if (!asset) notFound();

  return (
    <div className="container page-stack">
      <Link className="back-link" href={localizedPath(locale, "/assets")}><ArrowLeft size={15} /> {t("All asset policies")}</Link>
      <section className="asset-hero">
        <div className="asset-hero__identity">
          <AssetIcon asset={asset} size="lg" />
          <div><p className="eyebrow">{t(`${asset.class} asset`)}</p><h1>{asset.symbol} <span>{asset.name}</span></h1></div>
        </div>
        <div className="asset-hero__price"><span>{t("Reference price")}</span><strong>{formatCurrency(asset.price)}</strong><small>{t("deterministic fixture")}</small></div>
        <RouteModeBadge mode="ISR · tagged policy" tone="cyan" />
      </section>

      <div className="detail-metrics">
        <div><Waypoints /><span>{t("Connected rails")}</span><strong>{asset.networks.length}</strong></div>
        <div><ShieldCheck /><span>{t("Policy rules")}</span><strong>{asset.networks.length * 5}</strong></div>
        <div><Clock3 /><span>{t("Cache window")}</span><strong>{t("15 min")}</strong></div>
        <div><Coins /><span>{t("Product mode")}</span><strong>{t("Simulated")}</strong></div>
      </div>

      <section className="section-card">
        <div className="panel-header"><div><span className="panel-kicker">{t("NETWORK MATRIX")}</span><h2>{t("Deposit & withdrawal rules")}</h2></div><span className="policy-version">policy/v3</span></div>
        <div className="network-policy-grid">
          {asset.networks.map((network) => (
            <article className="network-policy-card" key={network.id}>
              <div className="network-policy-card__head">
                <div><span className="network-monogram">{network.name.slice(0, 2).toUpperCase()}</span><span><strong>{network.name}</strong><small>{network.chain}</small></span></div>
                <StatusPill locale={locale} status={network.status} />
              </div>
              <dl>
                <div><dt>{t("Availability")}</dt><dd><AvailabilityPills deposit={network.depositEnabled} withdrawal={network.withdrawalEnabled} locale={locale} /></dd></div>
                <div><dt>{t("Minimum")}</dt><dd>{formatAmount(network.minWithdrawal)} {asset.symbol}</dd></div>
                <div><dt>{t("Withdrawal fee")}</dt><dd>{formatAmount(network.withdrawalFee)} {asset.symbol}</dd></div>
                <div><dt>{t("Confirmations")}</dt><dd>{network.confirmations}</dd></div>
                <div><dt>{t("Estimated time")}</dt><dd>{translateRailTime(locale, network.estimatedMinutes)}</dd></div>
                {network.memoLabel ? <div><dt>{t("Routing field")}</dt><dd>{t(network.memoLabel)} {t("required")}</dd></div> : null}
              </dl>
              <Link className="text-link" href={localizedPath(locale, `/transfer?asset=${asset.symbol}&network=${network.id}`)}>{t("Use this rail")} <ArrowRight size={15} /></Link>
            </article>
          ))}
        </div>
      </section>

      <aside className="architecture-note">
        <span>{t("WHY ISR HERE")}</span>
        <p>{t("Network rules change less often than transaction state. A tagged cache gives global read performance while keeping incident-driven invalidation precise.")}</p>
        <Link href={localizedPath(locale, "/architecture")}>{t("Read the decision record")} <ArrowRight size={15} /></Link>
      </aside>
    </div>
  );
}

export default function AssetDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="container page-stack"><div className="skeleton skeleton--heading" /><div className="skeleton skeleton--form" /></div>}>
      <AssetPolicy params={params} />
    </Suspense>
  );
}
