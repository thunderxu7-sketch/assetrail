"use client";

import { usePathname } from "next/navigation";

import { isLocale, translate } from "@/lib/i18n";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean)[0];
  const locale = isLocale(segment) ? segment : "en";
  const t = (source: string) => translate(locale, source);

  return (
    <section className="empty-state container">
      <span className="empty-state__code">{t("RECOVERABLE")}</span>
      <h1>{t("The view hit an unexpected state.")}</h1>
      <p>{t("No real transaction was sent. Retry the isolated render without losing your input.")}</p>
      <button className="button button--primary" onClick={reset} type="button">
        {t("Retry render")}
      </button>
    </section>
  );
}
