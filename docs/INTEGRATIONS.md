# Integrations

> Every outside system and platform resource this app connects to.
> **Never write secret values here.** Names only.

## 🔌 Everything the app connects to
| Service / resource | What for | Binding or how | Status |
|---|---|---|---|
| OpenRouter | AI model calls (streaming, tool calling) | OpenAI SDK, `https://openrouter.ai/api/v1`, `src/agent.js` | 🟡 needs the owner's key |
| Cloudflare D1 `DB` | Optional data for tools | `d1_databases` in `wrangler.jsonc` (commented out) | ⚪ off |
| Cloudflare Workers Observability | Logs and metrics | `observability.enabled` in `wrangler.jsonc` | 🟢 on |

## 🔑 Secrets (set in the host, names only)
| Name | What it's for | Who sets it |
|---|---|---|
| `OPENROUTER_API_KEY` | Every model call | Owner (or their IT person): `npx wrangler secret put OPENROUTER_API_KEY` |

## ⚙️ Config (not secret)
| Name | Value / meaning |
|---|---|
| `MODEL` | `vars.MODEL` in `wrangler.jsonc`, default `openrouter/auto`. Must support tool calling |

## 💻 Local only (`.dev.vars` / `.env`, never in git or the host)
| Name | What for |
|---|---|
| `OPENROUTER_API_KEY` | A dev key so `npm run dev` can call the model |
| `MODEL` (optional) | Override the model locally |

## ⏰ Webhooks / scheduled jobs
| Trigger | What it does | Route or schedule |
|---|---|---|
| None yet | | |
