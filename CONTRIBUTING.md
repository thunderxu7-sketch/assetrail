# Contributing

1. Create a focused branch from `main`.
2. Keep policy rules in the domain layer; do not rely on client-only validation.
3. Add or update tests for behavior changes.
4. Run `npm run check` and `npm run test:e2e`.
5. Document rendering, security, or freshness trade-offs when they change.

Use Conventional Commits, for example: `fix(transfer): preserve state after polling failure`.

Never commit real keys, account data, private APIs, exchange branding, or examples that could be mistaken for real transactions.
