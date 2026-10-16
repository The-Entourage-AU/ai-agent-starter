# Decisions

> Important choices and **why**, so nobody (human or Claude) re-debates or undoes them by accident.
> Newest at the top. Never delete an entry; mark it "Replaced by #N" when it changes.

## 📋 Summary
| # | Decision | Date |
|---|---|---|
| 5 | 🚦 Push guard + lint and tests before every push | 2026-10-16 |
| 4 | 🤖 Orchestrator–worker: lanes and helper agents | 2026-10-16 |
| 3 | 💬 Chat entry point, no server-side memory | 2026-10-16 |
| 2 | 🧠 OpenRouter + model as config (`openrouter/auto`) | 2026-10-16 |
| 1 | 🏗️ Stack: Cloudflare Workers, plain JavaScript | 2026-10-16 |

## Template
```
### #N: [Short title] (YYYY-MM-DD)
- **Decision:** [what we chose]
- **Why:** [the reason]
- **Options rejected:** [what else we considered, and why not]
```

---

### #5: Push guard + lint and tests before every push (2026-10-16)
- **Decision:** A Claude Code hook blocks any `git push` with the wrong remote, a force push, or failing checks. `npm run build` runs Biome lint + Vitest.
- **Why:** Once connected to Workers Builds, pushing to `main` deploys, so a mistake goes straight to users. The guard catches it before it leaves the machine, and Workers Builds runs the same `npm run build`.
- **Options rejected:** Relying on Claude remembering to run the checks (memory isn't enforcement); CI-only checks (catch the problem after the push).

### #4: Orchestrator–worker: lanes and helper agents (2026-10-16)
- **Decision:** The main session plans, decides and reviews. Helpers do the work: `Explore`, `summarizer`, `test-runner` on `haiku`; `implementer`, `researcher`, `visual-qa` on `sonnet`. Every change is 🟢 Small (main session builds), 🟡 Medium (implementer) or 🔴 Large (full workflow). Sign-in, secrets, permissions, payments, deleting data and tools that act outside the app are always 🔴.
- **Why:** Cheaper and faster; keeps the main model's effort for planning and review; more checks where a mistake costs more. Short model names pick up new releases automatically.
- **Options rejected:** One model for everything (costly, slower); every helper on Haiku (lower quality for building code).

### #3: Chat entry point, no server-side memory (2026-10-16)
- **Decision:** Ship as a chat agent; the browser re-sends the conversation each turn.
- **Why:** The most common shape and the easiest to test. No storage needed. Other entry points (email, Slack, webhook, schedule) only add a route; the loop and tools stay the same.
- **Options rejected:** Agents SDK on a Durable Object from day one (more moving parts before the owner needs memory).

### #2: OpenRouter + model as config (2026-10-16)
- **Decision:** Call models through OpenRouter with the OpenAI SDK. The model is `vars.MODEL` in `wrangler.jsonc` (default `openrouter/auto`), never hard-coded.
- **Why:** One key reaches every major model, so the owner is never locked in and can switch per job.
- **Options rejected:** A direct provider SDK (locks the owner to one vendor).

### #1: Stack: Cloudflare Workers, plain JavaScript (2026-10-16)
- **Decision:** One Worker (`src/index.js`) serves the page and the API; optional D1 for data.
- **Why:** Cheap, fast, nothing to manage, deploys on a push, storage built in. Plain JavaScript moves to a Node host if Workers doesn't fit.
- **Options rejected:** A Node server (more to manage); a frontend framework (not needed for one chat page).
