# Performance strategy

## Release budgets

The project uses the current Core Web Vitals "good" thresholds at the 75th percentile as release budgets:

| Metric | Budget | User impact |
| --- | ---: | --- |
| LCP | ≤ 2.5 s | primary content becomes visible promptly |
| INP | ≤ 200 ms | form and navigation feedback remains responsive |
| CLS | ≤ 0.10 | status and policy content does not jump unexpectedly |

These are **targets**, not unmeasured claims. The `/performance` route shows samples from the current browser session through `useReportWebVitals`.

## Design controls

- Server Components are the default; only forms, polling, and field telemetry ship client behavior.
- Cache Components keep policy reads off the request critical path.
- Suspense skeletons reserve stable panel dimensions.
- Local fonts are served through `next/font` to avoid third-party font requests and reduce layout movement.
- Icons are imported individually from an ESM package.
- Large operational adapters resolve independently instead of blocking first content.
- The repository has no hero image, wallet SDK, chart framework, global state library, or analytics SDK.

## Verification

```bash
npm run build
npm run analyze:bundle
npm run test:e2e
```

For release testing, deploy a production build and run multiple mobile and desktop Lighthouse samples under consistent throttling. Record medians and compare route-by-route rather than reporting one best run.

## Regression response

1. Confirm whether the change is field-wide or route/device-specific.
2. Attribute the metric: resource waterfall for LCP, long tasks/event timing for INP, layout-shift sources for CLS.
3. Compare the bundle and rendering-mode output from `next build`.
4. Fix the responsible boundary rather than masking the metric.
5. rerun the browser suite and record the before/after measurement context.
