# Architecture decision record

## Context

A deposit/withdrawal frontend crosses more trust and availability boundaries than a typical dashboard. Policy can change during a session; a chain can degrade; retries can duplicate mutations; transaction state is personal and fast-moving; operational dependencies have uneven latency. The architecture therefore optimizes for **explicit freshness, contained failure, observable state, and replaceable adapters**.

## Route rendering decisions

| Route | Mode | Decision | Trade-off |
| --- | --- | --- | --- |
| `/` | static + cached reads | Make the product story immediately available with no request-time dependency | status copy is illustrative rather than live infrastructure data |
| `/assets` | SSG / Cache Components | Policy catalog is high-read and low-churn | freshness depends on an explicit invalidation signal |
| `/assets/[symbol]` | ISR + PPR | Prebuild popular assets and retain one route model for long-tail assets | a newly requested asset pays first-generation cost |
| `/transfers/[id]` | SSR | Transfer records are private, user-specific, and change frequently | request compute is higher than serving a shared cache |
| `/ops` | streaming | Independent sources should become useful independently | skeletons need stable, meaningful geometry |
| `/transfer` | server shell + client island | Only the form requires local interactivity | client policy preview must use the same canonical fixtures as the API |

## Boundaries

### Browser

The browser owns temporary form state, an idempotency key per intentional submission, progressive polling, and local Web Vitals. It is never authoritative for availability, amount rules, address validity, or transfer state.

### Route Handler

The mutation boundary checks:

1. request origin;
2. content type and declared size;
3. idempotency-key shape and replay cookie;
4. schema and domain policy;
5. output serialization into a signed private record.

No transaction signing or chain broadcast exists in this repository.

### Domain

`src/lib/transfers.ts` contains the policy validator and explicit state machine. These functions are framework-independent and unit-tested. A production adapter can replace cookie persistence without rewriting the form or timeline model.

### Cache control

Asset catalog and per-asset rules use separate tags. An allowlisted, bearer-token-protected Route Handler calls `revalidateTag(tag, "max")`, preserving stale-while-revalidate behavior without exposing arbitrary cache eviction.

## Production evolution

| Demo adapter | Production replacement | Preserved contract |
| --- | --- | --- |
| in-memory asset fixture | authenticated asset-policy service | `Asset` / `NetworkRule` |
| deterministic status timer | ledger + chain event stream | `TransferRecord` state machine |
| signed HttpOnly cookie | account-scoped transfer store | transfer lookup by ID |
| simulated risk score | risk decision service | `held` branch and reason metadata |
| local Web Vitals | sampled analytics/RUM sink | validated metric payload |
| static ops fixture | observability aggregation API | independent panel boundaries |

## Failure containment

- Invalid request: return field-level `422`; preserve form inputs.
- Duplicate request: return the existing record with `x-idempotent-replay: true`.
- Policy pause: block before mutation and preserve an alternate direction/rail.
- Slow operational source: stream other panels from separate Suspense boundaries.
- Polling interruption: retain the last server-rendered state and allow manual refresh.
- High-risk amount: transition to `held`, never auto-complete.
- Unknown ID or asset: render a controlled 404 instead of leaking internal state.

## Known constraints

- Cookie replay storage only demonstrates the contract for the latest browser-local record; production requires durable, account-scoped idempotency storage.
- The CSP permits inline scripts/styles for framework compatibility. A nonce-based CSP is the next hardening step where infrastructure supports request-specific nonces.
- Demo address checks validate encoding shape, not checksum, account existence, sanction screening, or ownership.
- Fixed policy fixtures cannot model chain reorganizations; production reconciliation must handle confirmation rollback.
