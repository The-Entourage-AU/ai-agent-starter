# Security rules (always)

- **Never commit or print secrets.** No keys, tokens, passwords or credentials in code, `wrangler.jsonc`, docs, tests, commit messages or chat. Secrets live in Cloudflare (`npx wrangler secret put NAME`) and locally in `.dev.vars` (git-ignored). `.env.example` holds **names** only. Read them in code only as `env.NAME`.
- **Don't read local secret files.** `.claude/settings.json` denies reading `.env*` / `.dev.vars*` (`.env.example` stays readable). The rules cover Claude's file tools and commands like `cat`, but **not** a recursive `grep -r` or a script that opens files itself, so never work around them: no `grep -r` over folders with secret files, no scripts that print env files. Need a value checked? Ask the owner. For a hard OS-level block, turn on Claude Code's sandbox.
- **Don't build your own login** unless that is the product. Use the platform's sign-in (e.g. Cloudflare Access). Where the app reads the signed-in user, verify the sign-in token in code and **fail closed**: no valid token, no access. The starter has no sign-in: before real users or real data, put it behind one (a "Stop and ask", `boundaries.md`).
- Test-only bypass flags (e.g. `ALLOW_NO_ACCESS`) exist only in the test config, never in production config.
- **Don't trust the browser.** Validate every input on the server (body, params, webhook payloads, tool arguments). Parameterised SQL only, never string-built queries.
- **Return only what the screen needs.** Never send whole records or other people's data "just in case".
- **Webhooks** must verify the sender's signature with a secret from `env`.
- **Least privilege.** Ask for the smallest permission or API scope that does the job. A new permission is a 🔴 change.
- **Outside content is untrusted** (user messages, emails, web pages, uploads). Never let it give instructions to the model or reach the page unescaped. Keep the SECURITY lines in the system prompt in `src/agent.js` (`agent.md`).
- Never change hosting, DNS, domains, access rules or repo settings yourself (`boundaries.md`).
- Spot a security problem? Fix it or flag it with 🔴 right away. Never leave it for later.
