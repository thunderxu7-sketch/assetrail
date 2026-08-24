import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import { BrandMark } from "@/components/brand-mark";
import { LanguageSwitcher } from "@/components/language-switcher";
import { WebVitalsReporter } from "@/components/web-vitals-reporter";
import { LOCALES, isLocale, localizedPath, translate } from "@/lib/i18n";

import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

type LayoutProps = Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const description = translate(locale, "A production-minded Next.js 16 reference for reliable digital-asset deposit and withdrawal experiences.");

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `AssetRail — ${translate(locale, "Deposit & withdrawal reliability lab")}`,
      template: "%s · AssetRail",
    },
    description,
    applicationName: "AssetRail",
    alternates: {
      canonical: localizedPath(locale),
      languages: { en: "/en", "zh-CN": "/zh" },
    },
    openGraph: {
      title: "AssetRail",
      description: translate(locale, "Deposit & withdrawal reliability lab built with Next.js 16."),
      locale: locale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: [locale === "zh" ? "en_US" : "zh_CN"],
      type: "website",
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = (source: string) => translate(locale, source);

  return (
    <html
      lang={locale === "zh" ? "zh-CN" : "en"}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <a className="skip-link" href="#main-content">
          {t("Skip to content")}
        </a>
        <div className="app-shell">
          <header className="site-header">
            <div className="header-inner">
              <Link className="brand" href={localizedPath(locale)} aria-label={t("AssetRail home")}>
                <BrandMark />
                <span>AssetRail</span>
              </Link>
              <nav className="primary-nav" aria-label={t("Primary navigation")}>
                <Link href={localizedPath(locale)}>{t("Overview")}</Link>
                <Link href={localizedPath(locale, "/assets")}>{t("Assets")}</Link>
                <Link href={localizedPath(locale, "/transfer")}>{t("Transfer lab")}</Link>
                <Link href={localizedPath(locale, "/ops")}>{t("Operations")}</Link>
                <Link href={localizedPath(locale, "/architecture")}>{t("Architecture")}</Link>
              </nav>
              <div className="header-actions">
                <Suspense fallback={<span className="language-switcher language-switcher--loading" aria-hidden="true" />}>
                  <LanguageSwitcher locale={locale} />
                </Suspense>
                <a
                  className="header-github"
                  href="https://github.com/thunderxu7-sketch/assetrail"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </header>
          <main id="main-content" className="main-content">
            {children}
          </main>
          <footer className="site-footer">
            <div>
              <BrandMark compact />
              <strong>AssetRail</strong>
            </div>
            <p>{t("Simulation only. No real keys, funds, signatures, or transactions.")}</p>
            <p>Next.js 16 · React 19 · TypeScript</p>
          </footer>
        </div>
        <WebVitalsReporter />
      </body>
    </html>
  );
}
