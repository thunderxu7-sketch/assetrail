# AI-assisted engineering workflow

AssetRail uses AI as a high-throughput collaborator while deterministic engineering controls retain authority.

## Workflow

1. **Frame the product risk**: identify user, money movement, policy, freshness, and operational failure modes before selecting technology.
2. **Write inspectable contracts**: types, Zod schemas, status transitions, cache tags, and error semantics are explicit artifacts.
3. **Decompose by trust boundary**: server data, client interaction, mutation, persistence, telemetry, and deployment are reviewed separately.
4. **Generate in small increments**: AI can propose implementation and test cases, but each increment must compile and preserve the contract.
5. **Run deterministic gates**: lint, strict types, unit tests, production build, Playwright, mobile overflow, and axe scans.
6. **Review risky claims**: reject fabricated benchmarks, fake on-chain links, unsupported security claims, and dependencies without clear value.
7. **Record trade-offs**: architecture, threat model, performance budget, test plan, and known constraints are committed with code.

## Tool-agnostic operating model

The process is designed to work with Claude, ChatGPT, Codex, Cursor, Grok, or a locally hosted model. Prompts and outputs are not the quality system; repository contracts and automated gates are.

## AI-safe acceptance rule

An AI-generated change is acceptable only when:

- its behavior is tied to a stated requirement or risk;
- the relevant test fails before the fix where practical;
- lint and strict types pass with zero warnings;
- no secret, private endpoint, or personal data enters the prompt or repository;
- a human can explain the architecture and failure behavior without relying on the chat history.

## Example review loop

```text
requirement → threat/failure inventory → typed contract → implementation
     ↑                                                  ↓
decision record ← visual review ← browser tests ← deterministic gates
```

## What is intentionally not automated

- accepting a security trade-off;
- approving a real-money product flow;
- claiming a performance result that was not measured;
- merging or deploying when a quality gate fails;
- deciding whether a policy change is legally or operationally authorized.
