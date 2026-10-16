# Cloudflare Workers: what's possible and the limits

**Plan:** [Free / Paid: ask the owner]. Check the limits for this plan before promising anything.

**You CAN build:** API servers, webhooks, full-stack apps, scheduled jobs (Cron Triggers), real-time or stateful agents (Durable Objects, Cloudflare's Agents SDK), queues, long multi-step jobs (Workflows), SQL (D1), key-value (KV), file storage (R2), AI calls over HTTP, sign-in (Access).

**Know before promising (approximate, verify current values):**
- No local filesystem for saving data. Use D1, KV or R2.
- No memory between requests. This starter re-sends the chat history each turn, so it needs none. For memory that survives (per-user state, long conversations), use the **Agents SDK** on a **Durable Object**.
- CPU time per request is limited. AI calls are mostly waiting (I/O), so normal agents are fine; long or autonomous jobs belong in **Workflows** or a queue.
- Every model, tool or API call is a subrequest, and there's a cap per request. Fetch in bulk.
- `nodejs_compat` is required: the OpenAI SDK uses Node built-ins.

**When to recommend a different host.** A long-running always-on process, heavy local compute, a big filesystem or a Node-only library may not fit Workers. Say so and point the owner at a Node-friendly host (Vercel, Railway, Render, Fly.io or a small VPS); `agent.js` and `tools.js` are plain JavaScript and move over. Recommend Workers because it fits, not by default.

**Research before saying "impossible."** Cloudflare changes fast:
- Limits: https://developers.cloudflare.com/workers/platform/limits/
- Changelog: https://developers.cloudflare.com/workers/platform/changelog/
- Pricing: https://developers.cloudflare.com/workers/platform/pricing/
- Access / Zero Trust: https://developers.cloudflare.com/cloudflare-one/

Needs something Workers can't do, or a plan change? That's a "Stop and ask" (`boundaries.md`).
