import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export default async function Loading() {
  const locale = await getLocale();
  return (
    <div className="container page-loading" aria-label={translate(locale, "Loading route")}>
      <div className="skeleton skeleton--eyebrow" />
      <div className="skeleton skeleton--heading" />
      <div className="skeleton-grid">
        <div className="skeleton skeleton--card" />
        <div className="skeleton skeleton--card" />
        <div className="skeleton skeleton--card" />
      </div>
    </div>
  );
}
