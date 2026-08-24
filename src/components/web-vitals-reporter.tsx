"use client";

import { useReportWebVitals } from "next/web-vitals";

type StoredMetric = {
  id: string;
  name: string;
  value: number;
  rating: string;
  delta: number;
  timestamp: number;
};

const STORAGE_KEY = "assetrail.vitals";
const STANDARD_METRICS = new Set(["FCP", "LCP", "CLS", "TTFB", "INP"]);

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (!STANDARD_METRICS.has(metric.name)) return;
    const entry: StoredMetric = {
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      timestamp: Date.now(),
    };

    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as StoredMetric[];
      const next = [...current.filter((item) => item.name !== entry.name), entry].slice(-12);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("assetrail:vitals", { detail: next }));
    } catch {
      // Storage may be unavailable in privacy modes; telemetry remains best-effort.
    }

    const payload = JSON.stringify(entry);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/vitals", new Blob([payload], { type: "application/json" }));
    }
  });

  return null;
}
