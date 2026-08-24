"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { replacePathLocale, type Locale } from "@/lib/i18n";

const options: Array<{ locale: Locale; label: string; title: string }> = [
  { locale: "en", label: "EN", title: "Switch to English" },
  { locale: "zh", label: "中文", title: "切换到中文" },
];

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  function remember(nextLocale: Locale) {
    void fetch("/api/locale", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ locale: nextLocale }),
      keepalive: true,
    });
  }

  return (
    <div className="language-switcher" role="group" aria-label={locale === "zh" ? "语言选择" : "Language selector"}>
      {options.map((option) => {
        const path = replacePathLocale(pathname, option.locale);
        const href = query ? `${path}?${query}` : path;
        return (
          <Link
            aria-current={option.locale === locale ? "page" : undefined}
            className={option.locale === locale ? "active" : undefined}
            href={href}
            hrefLang={option.locale === "zh" ? "zh-CN" : "en"}
            key={option.locale}
            lang={option.locale === "zh" ? "zh-CN" : "en"}
            onClick={() => remember(option.locale)}
            title={option.title}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
