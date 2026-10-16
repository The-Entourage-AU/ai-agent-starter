# AI Agent Starter

A ready-to-build starting point for **any AI agent** — an app that talks to an AI
model, can **use tools** (look things up, take actions), and does a real job for
your business. You build it by **talking to Claude Code**. You don't need to be a
developer.

> **Built and maintained by Abdo Samy at The Entourage.**

---

## How you use this

1. **Open this folder in Claude Code.**
2. **Tell Claude what you want your agent to do** — for example:
   *"a support assistant that answers from our help docs"*,
   *"an agent that reads incoming emails and drafts replies"*,
   *"a bot that looks up orders and tells customers their status."*
3. **Claude takes it from there.** It will:
   - ask you a few questions (what it does, who talks to it, what it can access,
     what it's allowed to do on its own),
   - check what's technically possible and flag any risks,
   - then build your agent and help you get it live.

That's the whole idea: **drop it in, describe the agent, let Claude build it.**

---

## What's already in the box

A working, model-agnostic agent you can talk to in minutes:

| File | What it is |
|------|-----------|
| `src/index.js` | Routing: serves the chat page and the `/api/chat` endpoint. |
| `src/agent.js` | The agent loop — talks to the AI, streams replies, runs tools. Rarely edited. |
| `src/tools.js` | **The part you'll grow most** — the agent's abilities. |
| `src/ui.js` | The starter chat page. Restyle or replace freely. |

It ships as a **chat agent** because that's the easiest to try. Reaching it another
way — email, Slack, a webhook, or a schedule — is a small change Claude makes for
you (see `CLAUDE.md`).

**Safe by default:** the agent treats anything it reads as data, not commands — so
untrusted input can't trick it into acting. Real-world actions (sending, deleting,
paying) are kept behind a human by default (see `CLAUDE.md`).

---

## The AI: one key, any model

The agent calls AI models through **[OpenRouter](https://openrouter.ai)** — a
single API key that reaches **every** model (Anthropic Claude, OpenAI GPT, Google
Gemini, and more). You're never locked to one. Claude helps you pick the right
model for your job.

---

## Try it locally (optional)

1. Install dependencies once:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.dev.vars` and paste your OpenRouter key.
3. Start it:
   ```bash
   npm run dev
   ```
4. Open the address it prints and chat with the agent.

---

## Where it runs

Recommended host: **[Cloudflare Workers](https://developers.cloudflare.com/workers/)**
— cheap, fast, nothing to manage, deploys on a `git push`, and it fits most agents
(chat, webhooks, scheduling, storage all built in). Deploy with `npm run deploy`,
or connect your GitHub repo so every push goes live automatically.

Not on Cloudflare? The core agent is plain JavaScript and can be adapted to a Node
host (Vercel, Railway, Render, Fly.io, a VPS). Ask Claude — see `CLAUDE.md`.

---

## The important file

**`CLAUDE.md`** is the brain of this project. It tells Claude how to interview you,
check feasibility, flag risks, and build your agent well. You don't need to read
it — it's why dropping this into Claude Code just works.

---

## 🧠 How Claude remembers this project

| Piece | What it does |
|---|---|
| `CLAUDE.md` | Read every session: what the project is, how Claude works, how changes ship |
| `.claude/rules/` | House rules: how Claude talks to you, how work is split into 🟢🟡🔴 lanes, boundaries, security, testing, clean code, agent rules |
| `.claude/agents/` | Helpers that search, build, test and check on cheaper, faster models; the main model plans and reviews. Type `@` to call one (e.g. `@researcher`) |
| `.claude/hooks/` | 🚦 A push guard that blocks a push to the wrong repo, a force push, or a push with failing checks |
| `docs/` | The project's memory: what's live, how it works, decisions, integrations, how to fix things |
| `/update-docs` | Type it at the end of a session to save progress into `docs/` |

**Checks:** `npm run build` runs the linter (Biome) and the tests (Vitest) before every push and every deploy.
**Made your own copy?** Ask Claude to set `EXPECTED_REMOTE` in `.claude/hooks/pre-push-guard.sh` to your repo, so the push guard lets your pushes through.

<sub>Claude structure by [Abdo Samy](https://abdosamy.com) · [Claude Code Setup Kit](https://github.com/a-samy-consultancy/claude-code-setup-kit)</sub>

---

*Questions about the starter itself: Abdo Samy, The Entourage.*
