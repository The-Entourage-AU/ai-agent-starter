# Current state

> What's live, what's being built, what's next. Claude reads this at the start of every session.
> Keep it short and current: replace stale lines instead of adding history.

**Last updated:** 2026-10-16

## 🚦 At a glance

| Area | Status | Note |
|---|---|---|
| Live app | 🟡 | Not live yet: each owner deploys their own copy |
| Checks (lint + tests) | 🟢 | 9 tests passing (`npm run build`) |
| Deploy on push | 🟡 not connected | Connect the repo to Cloudflare Workers Builds, or use `npm run deploy` |

## ✅ Live
- Starter chat agent: chat page (`GET /`), streaming `POST /api/chat`, OpenRouter model calls, tool loop with `MAX_STEPS` guard.
- One example tool: `get_current_time`. A commented-out `search_records` D1 example.

## 🚧 In progress
- Nothing

## 🔜 Next
- [Owner: describe the agent you want; Claude interviews you first (`.claude/rules/agent.md`)]

## ⏳ Waiting on
- Nothing

## 🐞 Known issues
- 🟡 `runAgent` in `src/agent.js` is over Biome's complexity limit (49 vs 25, a warning). Split it into named helpers when the loop next changes.
- 🟡 No sign-in on the chat page. Anyone with the URL can spend model credits. Put it behind sign-in (e.g. Cloudflare Access) before sharing the link.
