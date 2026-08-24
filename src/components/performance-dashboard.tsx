"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle2, Gauge, RotateCcw } from "lucide-react";

type StoredMetric = { id: string; name: string; value: number; rating: string; delta: number; timestamp: number };

const thresholds: Record<string, { good: number; poor: number; unit: string }> = {
  LCP: { good: 2_500, poor: 4_000, unit: "ms" },
  INP: { good: 200, poor: 500, unit: "ms" },
  CLS: { good: 0.1, poor: 0.25, unit: "" },
  FCP: { good: 1_800, poor: 3_000, unit: "ms" },
  TTFB: { good: 800, poor: 1_800, unit: "ms" },
};

const displayMetrics = ["LCP", "INP", "CLS"];

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<StoredMetric[]>([]);

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
              <p>{rating === "waiting" ? "Browse the app to collect a local sample" : `${rating} field rating`}</p>
              <div className="budget-line"><span style={{ width: metric ? `${Math.min(100, (metric.value / target.poor) * 100)}%` : "0%" }} /></div>
              <small>Good threshold ≤ {target.good}{target.unit}</small>
            </article>
          );
        })}
      </div>
      <section className="field-telemetry section-card">
        <div className="panel-header"><div><span className="panel-kicker">LOCAL FIELD TELEMETRY</span><h2>Current browser session</h2></div><button className="icon-button" onClick={clear} type="button"><RotateCcw size={15} /> Reset</button></div>
        {metrics.length ? (
          <div className="telemetry-list">{metrics.map((metric) => <div key={metric.name}><span className={`rating-dot rating-dot--${metric.rating}`} /><strong>{metric.name}</strong><code>{metric.name === "CLS" ? metric.value.toFixed(3) : `${Math.round(metric.value)} ms`}</code><span>{metric.rating}</span><small>{new Date(metric.timestamp).toLocaleTimeString()}</small></div>)}</div>
        ) : (
          <div className="telemetry-empty"><Activity /><strong>No local samples yet</strong><p>Navigate through several routes, interact with the transfer form, then return. Web Vitals are captured through the framework reporter.</p></div>
        )}
      </section>
      <section className="budget-checklist">
        <div><CheckCircle2 /><span><strong>Stable geometry</strong><small>Explicit skeleton and card dimensions reduce layout shifts.</small></span></div>
        <div><CheckCircle2 /><span><strong>Small client boundary</strong><small>Interactivity is isolated from cached server-rendered content.</small></span></div>
        <div><CheckCircle2 /><span><strong>Production feedback loop</strong><small>Field signals can be sent to the provided ingestion contract.</small></span></div>
      </section>
    </>
  );
}
