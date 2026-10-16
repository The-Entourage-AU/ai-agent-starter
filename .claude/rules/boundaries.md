# Boundaries: what Claude does alone vs. what needs the owner (or your IT person)

The owner should never be left stuck: either Claude does it, or Claude hands over ready-to-follow steps or a ready-to-send request.

## 👥 Who owns what

The owner owns their own GitHub repo, Cloudflare (or other host) account, API keys and data. If they have an IT person or team, that person may own some of these: ask once, then fill in the table.

| Area | Who controls it | Contact |
|---|---|---|
| Code | Claude writes, the owner decides | |
| Hosting account (Cloudflare) | [the owner / your IT person] | [...] |
| Domain + DNS | [the owner / your IT person] | |
| GitHub / repo settings | [the owner / your IT person] | |
| Secrets and API keys (`OPENROUTER_API_KEY`, any other) | [the owner / your IT person] | |
| Who can sign in | [the owner / your IT person] | |

## ✅ Claude CAN do freely

- Frontend and backend code, refactors, bug fixes, tools and features using resources that already exist.
- Add, change or remove tables and columns in a database that **already exists** (a `d1_databases` binding is in `wrangler.jsonc`; non-destructive by default, `database.md`).
- Add libraries, as long as the checks still pass.
- Write and update tests and docs.

## 🛑 Stop and ask for

1. A new database, storage bucket, queue or other resource that doesn't exist yet. *Does it exist? Check `wrangler.jsonc` for its binding. No binding = it doesn't exist.*
2. Adding or changing a secret or API key.
3. A domain, subdomain or any DNS change.
4. Changing who can sign in.
5. Any hosting dashboard setting, account setting, access rule, or the GitHub-to-Cloudflare connection.
6. Creating a repo or changing repo settings.
7. A plan or billing change, or anything that costs money.
8. Something Workers can't do that needs an infrastructure decision (`cloudflare.md`).

When you hit one:
1. Explain in one plain line why it needs the owner (or their IT person).
2. **Owner controls it:** give numbered steps, **one at a time**, and wait for each to be done. **Their IT person controls it:** generate the request below, complete enough that they can act in one pass.
3. Say: "I'll keep building in the meantime."
4. Log it under "⏳ Waiting on" in `docs/CURRENT-STATE.md`.

## 🔑 Secrets: owner steps (when the owner controls them)

1. Production: `npx wrangler secret put OPENROUTER_API_KEY`, then paste the key when asked (repeat per secret). Or: Cloudflare dashboard → the Worker → Settings → Variables and Secrets.
2. Local testing: copy `.env.example` to `.dev.vars` (git-ignored) and put a dev key there so `npm run dev` works.
3. Claude never asks for, sees or stores the value.

## 📨 Request template (when your IT person controls it)

```
Hi [IT person's name],

I'm working on [PROJECT / REPO] and need something set up before I can continue.

WHAT I NEED: [e.g. a new D1 database for this agent]
WHY: [the feature, and what this resource is for, in plain words]

DETAILS:
- Resource type: [database / storage / secret / domain / access change / other]
- Suggested name: [e.g. my-agent-db]
- What it will hold: [...]
- Rough scale: [small / medium, rough counts if known]
- Secret needed?: [yes/no. If yes, which service and what for. NEVER include the value.]

BLOCKING?: [am I blocked, or can I keep building while I wait?]

Thanks!
```

## 🔒 Access change template

```
Hi [IT person's name],

Can you please adjust who can sign in to [PROJECT / REPO]?

CURRENT: [who can access it today]

REQUESTED: [e.g. only these people: name / email, name / email]

WHY: [e.g. the agent can read customer records, so only the support team should use it]

Thanks!
```

## ⏳ While waiting

- Keep building as if the resource exists, using the suggested name.
- Don't push anything half-wired that would break the live app. Guard code that needs the missing resource.
- Non-secret config (like a `database_id`) arrives as a change to `wrangler.jsonc`; pull and continue. Secrets are set in Cloudflare and read in code as `env.NAME`. Claude never sees or stores the value.
