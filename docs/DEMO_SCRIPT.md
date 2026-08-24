# Five-minute interview demo

## 0:00–0:45 — frame the problem

“A deposit/withdrawal page looks like a form, but it is really a state machine across policy, risk, signing, chain gateways, confirmations, and ledger reconciliation. AssetRail makes those boundaries visible without pretending to move real funds.”

Open `/` and point out the transfer pipeline, network availability, and rendering cards.

## 0:45–1:45 — rendering strategy

Open `/architecture`.

- `/assets` is high-read, low-churn policy data: SSG with tagged cache invalidation.
- `/assets/[symbol]` uses ISR and partial prerendering: popular assets are prebuilt; one route supports the long tail.
- `/transfers/[id]` is private and fast-changing: SSR plus a small polling island.
- `/ops` streams independent panels so one slow adapter does not block the command surface.

Key line: “I choose freshness and failure semantics per route; SSR/SSG/ISR are consequences, not goals.”

## 1:45–3:00 — product and reliability flow

Open `/transfer`.

1. Show the policy preview and canonical network rules.
2. Select XRP and explain the maintenance block and required destination tag.
3. Return to USDT/TRON and submit the prefilled demo request.
4. On the receipt, show progressive states and the deliberate absence of an explorer link.

Key line: “The server repeats every policy check; the client preview improves usability but is never authoritative.”

## 3:00–3:45 — trust boundaries

On `/architecture`, show the input → policy → domain → private state flow.

Mention same-origin validation, bounded JSON, Zod, required idempotency key, replay response, HMAC-signed HttpOnly cookie, strict security headers, and the high-value manual-hold branch.

Be explicit: durable account-scoped storage, checksum/sanctions validation, authorization, signing, and chain reconciliation are production adapters—not faked in this demo.

## 3:45–4:25 — performance and operations

Open `/ops` and reload to show independent streaming boundaries. Then open `/performance`.

Key line: “I use LCP, INP, and CLS budgets. The page reports real local browser samples; the README never promotes an unmeasured score.”

## 4:25–5:00 — AI engineering and delivery

Open the repository quality workflow and `docs/AI_WORKFLOW.md`.

“AI accelerates decomposition, implementation, and test generation, but deterministic gates own acceptance: strict types, lint, unit tests, production build, browser journeys, mobile overflow, and axe.”

Close with the production replacement table in `docs/ARCHITECTURE.md` to demonstrate full-stack ownership without overstating the simulation.
