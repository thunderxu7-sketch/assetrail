"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle2, Gauge, RotateCcw } from "lucide-react";

import { translate, type Locale } from "@/lib/i18n";

type StoredMetric = { id: string; name: string; value: number; rating: string; delta: number; timestamp: number };

const thresholds: Record<string, { good: number; poor: number; unit: string }> = {
  LCP: { good: 2_500, poor: 4_000, unit: "ms" },
  INP: { good: 200, poor: 500, unit: "ms" },
  CLS: { good: 0.1, poor: 0.25, unit: "" },
  FCP: { good: 1_800, poor: 3_000, unit: "ms" },
  TTFB: { good: 800, poor: 1_800, unit: "ms" },
};

const displayMetrics = ["LCP", "INP", "CLS"];

export function PerformanceDashboard({ locale }: { locale: Locale }) {
  const [metrics, setMetrics] = useState<StoredMetric[]>([]);
  const t = (source: string, values: Record<string, string | number> = {}) => translate(locale, source, values);

  useEffect(() => {
    const read = () => {
      try { setMetrics(JSON.parse(localStorage.getItem("assetrail.vitals") ?? "[]") as StoredMetric[]); } catch { setMetrics([]); }
    };
    read();
    window.addEventListener("assetrail:vitals", read);
    return () => window.removeEventListener("assetrail:vitals", read);
  }, []);

  function clear() {
    localStorage.removeItem("assetrail.vitals");
    setMetrics([]);
  }

  return (
    <>
      <div className="vitals-grid">
        {displayMetrics.map((name) => {
          const metric = metrics.find((entry) => entry.name === name);
          const target = thresholds[name];
          const value = metric ? (name === "CLS" ? metric.value.toFixed(3) : Math.round(metric.value).toString()) : "—";
          const rating = metric?.rating ?? "waiting";
          return (
            <article className={`vital-card vital-card--${rating}`} key={name}>
              <div><span>{name}</span><Gauge size={18} /></div>
              <strong>{value}<small>{metric ? target.unit : ""}</small></strong>
              <p>{rating === "waiting" ? t("Browse the app to collect a local sample") : t("{rating} field rating", { rating: t(rating) })}</p>
              <div className="budget-line"><span style={{ width: metric ? `${Math.min(100, (metric.value / target.poor) * 100)}%` : "0%" }} /></div>
              <small>{t("Good threshold ≤ {value}{unit}", { value: target.good, unit: target.unit })}</small>
            </article>
          );
        })}
      </div>
      <section className="field-telemetry section-card">
        <div className="panel-header"><div><span className="panel-kicker">{t("LOCAL FIELD TELEMETRY")}</span><h2>{t("Current browser session")}</h2></div><button className="icon-button" onClick={clear} type="button"><RotateCcw size={15} /> {t("Reset")}</button></div>
        {metrics.length ? (
          <div className="telemetry-list">{metrics.map((metric) => <div key={metric.name}><span className={`rating-dot rating-dot--${metric.rating}`} /><strong>{metric.name}</strong><code>{metric.name === "CLS" ? metric.value.toFixed(3) : `${Math.round(metric.value)} ms`}</code><span>{t(metric.rating)}</span><small>{new Date(metric.timestamp).toLocaleTimeString(locale === "zh" ? "zh-CN" : "en")}</small></div>)}</div>
        ) : (
          <div className="telemetry-empty"><Activity /><strong>{t("No local samples yet")}</strong><p>{t("Navigate through several routes, interact with the transfer form, then return. Web Vitals are captured through the framework reporter.")}</p></div>
        )}
      </section>
      <section className="budget-checklist">
        <div><CheckCircle2 /><span><strong>{t("Stable geometry")}</strong><small>{t("Explicit skeleton and card dimensions reduce layout shifts.")}</small></span></div>
        <div><CheckCircle2 /><span><strong>{t("Small client boundary")}</strong><small>{t("Interactivity is isolated from cached server-rendered content.")}</small></span></div>
        <div><CheckCircle2 /><span><strong>{t("Production feedback loop")}</strong><small>{t("Field signals can be sent to the provided ingestion contract.")}</small></span></div>
      </section>
    </>
  );
}
