import Link from "next/link";

import { localizedPath, translate } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export default async function NotFound() {
  const locale = await getLocale();
  const t = (source: string) => translate(locale, source);
  return (
    <section className="empty-state container">
      <span className="empty-state__code">404</span>
      <h1>{t("That rail is not connected.")}</h1>
      <p>{t("The requested asset policy or transfer record does not exist in this simulation.")}</p>
      <Link className="button button--primary" href={localizedPath(locale)}>
        {t("Return to overview")}
      </Link>
    </section>
  );
}
