---
paths:
  - "src/**"
  - "tests/**"
---

# Clean code (every change)

The project keeps growing. Keep each change easy to read and safe to change later.

## Before every push
1. Run `/simplify` on the changed code (duplication, dead code, long functions, unclear names, leftover debug code).
2. Run `/code-review` for bugs. Fix what it finds or say why not.
3. Run `npm run build`: lint errors fail the build, same as tests.

## Rules
- **One job per function.** If a function needs comments to explain its sections, split it into named helpers. Treat complexity warnings from the linter as a to-do, not noise.
- **One job per file.** `src/index.js` only routes; the model call lives only in `src/agent.js`; tools in `src/tools.js`; the page in `src/ui.js`. Each new outside API gets its own small file. Put new logic where its job already lives, or in a new small file.
- **Reuse before writing.** Search for an existing helper before adding one.
- **No copy-paste variants.** If two paths differ only in data, pass the data in.
- **Guard clauses over nesting.** Return early on bad input or nothing to do.
- **Names say what, not how.** `pendingOrders`, not `arr2`. Booleans read as questions: `isPaid`, `hasDraft`.
- **Comments explain why**, never what the code already says.
- **No dead code.** Delete unused functions, commented-out blocks, debug logging. Git keeps the history. (The commented-out `search_records` example in `src/tools.js` is a deliberate starter pattern: remove it once a real data tool exists.)
- **Cleanup changes how, never what.** Refactor in small steps with tests green after each. Behaviour changes go in separate commits.

## Linter
- Config: `biome.json`, lint only (no formatter, so diffs stay readable). Rules are strict: fix errors, don't downgrade them.
- `npm run lint` checks; `npx biome lint --write` applies safe fixes.
