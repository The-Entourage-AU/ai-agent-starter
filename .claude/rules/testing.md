# Testing (always)

Checks protect the live app: `npm run build` runs lint + tests, and Cloudflare Workers Builds runs it on every deploy (once the repo is connected), so **a failing check stops a broken deploy**. The 🚦 push guard runs it before every push too.

## What to test (keep it light)

Test the critical paths only:
- **API routes:** the right answer for good input, a clear error for bad input (`tests/api.test.js`).
- **Tools:** every tool gets a test; call it with `runTool(name, input, env)` (`tests/tools.test.js`).
- **Logic:** calculations, data processing, formatting, permission checks.
- **Scheduled jobs:** call the pure logic they use directly, not the scheduler.
- **The agent:** test the code around the model (tool inputs, output cleaning), never the model's wording. Model answers vary.

Don't test every button, layout or style. Check those visually (below).

## How

- Tests live in `tests/` as `*.test.js`. Vitest with Cloudflare's plugin (`@cloudflare/vitest-plugin`): they run inside the real Workers runtime. Call routes with `exports.default.fetch(...)` from `cloudflare:workers`; import pure functions straight from `src/`.
- Keep pure logic in small functions so it's easy to test.
- **Never call real outside services, real AI models or real secrets.** `OPENROUTER_API_KEY` is blanked in `vitest.config.js`, even if a local `.dev.vars` exists. Add every new secret there too. Mock an outside API if a test needs its reply.
- With a database: apply the real migrations to a throwaway local database before each test file (`database.md`).
- `npm test` while working; `npm run build` before every push.

## When a test fails

Find the real cause and fix the code (or the test, if the behaviour changed on purpose). **Never delete or skip a test to get green.**

## Checking the UI

For screen changes, run `npm run dev` and check the chat page at desktop (1440) and phone (390) width with `visual-qa`: it loads, looks right, sending a message works, no console errors.
