# Threat model

## Assets to protect

In a production exchange these would include authentication state, withdrawal intent, destination integrity, account balance, signing authorization, transaction identifiers, risk decisions, and operational telemetry. AssetRail intentionally owns none of those real assets; its goal is to demonstrate where controls belong.

## Trust boundaries

1. **Untrusted browser → Route Handler**: all fields and headers are attacker-controlled.
2. **Route Handler → domain policy**: parsed input must still satisfy product/network rules.
3. **Private transfer state → browser**: state is serialized only into an HMAC-signed HttpOnly cookie.
4. **Operations source → rendered UI**: slow or unavailable dependencies must not block unrelated panels.
5. **Deployment operator → cache control**: revalidation requires an independent secret and allowlisted tags.

## Abuse cases and controls

| Threat | Control in this repository | Production extension |
| --- | --- | --- |
| CSRF mutation | same-origin check + SameSite Strict cookie | anti-CSRF token for complex cross-site auth flows |
| oversized/malformed payload | JSON type and declared 4 KB cap + parse failure | edge/proxy body limit and request timeout |
| duplicate withdrawal | required idempotency key + replay response | durable account/action idempotency record |
| client-side policy bypass | canonical server Zod refinement | versioned policy service and authorization |
| cookie modification | HMAC signature + constant-time comparison | server-side session/state store |
| clickjacking | CSP `frame-ancestors 'none'` + `X-Frame-Options: DENY` | keep controls at CDN and origin |
| data exfiltration | restrictive CSP/connect source and no secrets in client | nonce CSP, outbound allowlist, DLP monitoring |
| arbitrary cache eviction | bearer token + exact tag enum | secret rotation, audit trail, rate limiting |
| fabricated success | explicit simulation labeling and no explorer URL | signed backend state with ledger reconciliation |
| high-value automation | deterministic manual-hold branch | risk engine, step-up auth, dual control |

## Secret handling

- `TRANSFER_COOKIE_SECRET` and `REVALIDATION_TOKEN` are server-only variables.
- `.env*` files are ignored except the placeholder `.env.example`.
- The production cookie uses `Secure`, `HttpOnly`, `SameSite=Strict`, a one-hour lifetime, and a root path.
- The fallback cookie secret is explicitly development-only; production deployment must configure a random value.

## Deliberate non-features

There is no wallet SDK, private key, signing service, RPC endpoint, custody integration, real account, market-data dependency, or chain explorer link. Adding fake implementations would teach unsafe trust assumptions and make the demo look more complete than it is.
