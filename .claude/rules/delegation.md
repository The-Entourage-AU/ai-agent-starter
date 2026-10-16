# Delegation lanes and workflow (always)

The main session (🧠 planner, best on `opus`) **plans, decides and reviews**. Helpers in `.claude/agents/` **do the work**. This is the *orchestrator–worker* pattern: the expensive model thinks, cheaper models search, build and check.

## 🚦 Step 0: pick the lane, say it first

Before any change, tell the owner the lane in one line, e.g. "🟢 **Small:** fixing the footer link myself." The owner can say "make it 🔴" to move it up.

| Lane | Examples | Who builds |
|---|---|---|
| 🟢 **Small** | Typo, colour, link, a 1–2 file tweak | 🧠 Planner directly. A handoff would cost more than the fix. |
| 🟡 **Medium** | New tool, new field, a bug across a few files | 🛠️ `implementer` from the planner's short plan |
| 🔴 **Large** | New entry point (email, webhook, schedule), new feature or page, structural change | Full workflow below |

**Overrides:** 🔐 sign-in, secrets, permissions, payments or deleting data are **always 🔴**, even one line. So is any tool that **changes** something outside the app (sends, updates, pays, deletes) and any change to the system prompt's SECURITY lines. 🎨 Visual or copy changes get **options for the owner to pick** first, in any lane.

## 🤝 Handoff to the implementer (🟡🔴)
Give it: the goal, files to touch, exact behaviour, edge cases, what "done" means, which checks to run. It reports back. It never commits, pushes, deploys or touches secrets (blocked by its hook).

## 🧩 Helpers
| Agent | Model | Job |
|---|---|---|
| 🔎 `Explore` | haiku | Find code (read-only) |
| 📄 `summarizer` | haiku | Summarise long material: logs, docs, exports (read-only) |
| 🌐 `researcher` | sonnet | Official docs + web, short brief with links and "My pick" |
| 🛠️ `implementer` | sonnet | Builds 🟡🔴 plans |
| 🧪 `test-runner` | haiku | Runs the checks, returns failures only |
| 📱 `visual-qa` | sonnet + browser | Desktop + phone check of the chat page |

## 🗺️ Workflow: AI Agent Starter (🟡 medium: reads untrusted user text and spends model credits)

**The more a project can hurt its owner, the more checks it gets.** Once the agent handles customer or personal data, sends messages or acts on someone's behalf, it is 🔴: update this heading and `CLAUDE.md`, and step 7b then also runs on anything touching sign-in, secrets, permissions, payments or personal data.

| Step | Who | What | 🟢 | 🟡 | 🔴 |
|---|---|---|---|---|---|
| 1 | 🗣️ Owner | Describes the idea | ✅ | ✅ | ✅ |
| 2 | 🧠 Planner | Pressure-tests, picks the lane, writes the plan (`agent.md` interview for a new agent) | ✅ | ✅ | ✅ |
| 3 | 🌐 Researcher | OpenRouter / Cloudflare docs, if new | | if new | ✅ |
| 4 | 🛠️ Implementer | Builds the plan (🟢: the planner builds) | | ✅ | ✅ |
| 5 | 🧪 Test-runner | `npm run build` (lint + tests) | ✅ | ✅ | ✅ |
| 6 | 📱 Visual QA | Local run (`npm run dev`), desktop + phone | if UI | if UI | ✅ |
| 7 | 🔍 Review (planner) | `/simplify` + `/code-review` | ✅ | ✅ | ✅ |
| 7b | 🔐 Security (planner) | `/security-review` | | | ✅ |
| 8 | ✅ Owner → 🚦 Hook | Approves → guard checks remote + checks → push → live | ✅ | ✅ | ✅ |
