# Test plan

## Objective

Verify that AssetRail communicates and enforces the simulated deposit/withdrawal contract across business policy, reliability, rendering, security, performance, accessibility, and responsive behavior.

## Risk-based scope

### P0 — transfer integrity

- supported asset/network combinations are accepted;
- disabled directions are rejected on the server even if the UI is bypassed;
- minimums, address families, and destination tags are enforced;
- duplicate submissions return the same browser-local record;
- high-value requests enter `held` and cannot auto-complete;
- signed state rejects tampering;
- no UI implies that a real transaction or explorer record exists.

### P1 — availability and recovery

- active transfers progress through the explicit state machine;
- polling failure preserves the last server-rendered state;
- manual refresh is available;
- operations panels stream independently;
- invalid asset/transfer routes render controlled 404 states;
- maintenance and congestion are visually distinct and accessible by text.

### P1 — rendering and cache behavior

- production build reports static `/assets`, ISR popular asset details, partial-prerendered `/ops`, and private partial-prerendered transfer details;
- revalidation rejects missing/wrong tokens and unknown tags;
- transfer APIs return `private, no-store`;
- asset policy tags remain scoped.

### P1 — web quality

- no serious/critical axe violations on primary routes;
- keyboard focus is visible and the skip link works;
- mobile overview has no viewport-level horizontal overflow;
- tabular overflow is locally scrollable rather than clipping the page;
- reduced-motion preference disables nonessential animation;
- console remains free of application errors in the main journey.

## Automated matrix

| Layer | Tool | Coverage |
| --- | --- | --- |
| domain | Vitest | schema refinements, address families, lifecycle, high-risk hold, signed state |
| request boundary | Vitest | origin and bounded JSON controls |
| browser | Playwright | overview, asset rules, successful transfer, blocked maintenance rail |
| accessibility | axe + Playwright | WCAG A/AA serious/critical scan |
| responsive | Playwright device profiles | desktop Chromium and Pixel 7 viewport |
| build | Next.js production build | route mode and prerender verification |
| static quality | ESLint + TypeScript | zero warnings and strict type correctness |

## Manual release checklist

- [ ] Confirm all copy says simulation/demo where money movement could be inferred.
- [ ] Exercise USDT/TRON successful flow and 100,000-unit hold flow.
- [ ] Exercise XRP maintenance and destination-tag validation.
- [ ] Reload a transfer detail page and confirm private state persists for the cookie lifetime.
- [ ] Navigate with keyboard only through header, form, and status controls.
- [ ] Inspect desktop and 390 px layouts.
- [ ] Validate security and cache headers on the deployed origin.
- [ ] Collect consistent Lighthouse samples and compare with budgets.
- [ ] Confirm no `.env`, secret, real user address, or private endpoint is in the repository.

## Exit criteria

- `npm run check` passes;
- Playwright passes for desktop and mobile projects;
- no P0 defects are open;
- no serious/critical accessibility finding is open;
- production route output matches the architecture table;
- deployment smoke tests return 200 and required security headers.
