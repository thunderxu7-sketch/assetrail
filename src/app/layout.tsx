import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

import { BrandMark } from "@/components/brand-mark";
import { WebVitalsReporter } from "@/components/web-vitals-reporter";

import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AssetRail — Deposit & withdrawal reliability lab",
    template: "%s · AssetRail",
  },
  description:
    "A production-minded Next.js 16 reference for reliable digital-asset deposit and withdrawal experiences.",
  applicationName: "AssetRail",
  openGraph: {
    title: "AssetRail",
    description: "Deposit & withdrawal reliability lab built with Next.js 16.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <div className="app-shell">
          <header className="site-header">
            <div className="header-inner">
              <Link className="brand" href="/" aria-label="AssetRail home">
                <BrandMark />
                <span>AssetRail</span>
              </Link>
              <nav className="primary-nav" aria-label="Primary navigation">
                <Link href="/">Overview</Link>
                <Link href="/assets">Assets</Link>
                <Link href="/transfer">Transfer lab</Link>
                <Link href="/ops">Operations</Link>
                <Link href="/architecture">Architecture</Link>
              </nav>
              <a
                className="header-github"
                href="https://github.com/thunderxu7-sketch/assetrail"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
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
            <p>Simulation only. No real keys, funds, signatures, or transactions.</p>
            <p>Next.js 16 · React 19 · TypeScript</p>
          </footer>
        </div>
        <WebVitalsReporter />
      </body>
    </html>
  );
}
