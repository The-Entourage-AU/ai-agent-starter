# Runbook

> How to run, test, deploy and fix this app. Add every fix for an error that could happen again.

## 🧯 Problem → fix
| Problem | Cause | Fix |
|---|---|---|
| 🚦 Push blocked: wrong remote | `origin` isn't the expected repo | Check `git remote -v`; tell the owner. Never edit the guard to get past it. Own copy of the starter: the owner sets `EXPECTED_REMOTE` once. |
| 🚦 Push blocked: checks failed | Lint or a test failed | Run `npm run build`, fix the real cause, push again. |
| Chat says "OPENROUTER_API_KEY is not set" | No key in this environment | Locally: add it to `.dev.vars`. Live: `npx wrangler secret put OPENROUTER_API_KEY`. |
| "Stopped after 10 tool steps" | The model kept calling tools | Check the tool results make sense; raise `MAX_STEPS` in `src/agent.js` only if expected. |
| Deploy didn't happen | The Workers Builds build failed | Check the build log in Cloudflare dashboard → the Worker → Deployments; run `npm run build` locally. |

## 💻 Run locally
1. `npm install` (once)
2. Copy `.env.example` to `.dev.vars` and add a dev OpenRouter key.
3. `npm run dev`, then open the local link and chat.

## 🧪 Test
- `npm test` runs the tests. `npm run lint` runs the linter.
- `npm run build` runs both. The push guard and Workers Builds run it before every push and deploy.

## 🚀 Deploy
- Connected to Workers Builds: push to `main`; it builds and deploys in about a minute.
- Not connected yet: `npm run deploy` (logs in to the owner's Cloudflare account the first time).
- If the build fails, nothing is deployed and the previous version stays live.

## 📜 Logs
- Cloudflare dashboard → the Worker → Logs (observability is on).

## 👤 Who to contact
- Accounts, secrets, domains, access: the owner, or their IT person (`.claude/rules/boundaries.md`).
- Questions about the starter itself: Abdo Samy, The Entourage.
