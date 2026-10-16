---
paths:
  - "src/**"
---

# Backend standards

- **Structure:** `src/index.js` only routes requests. The agent loop is `src/agent.js`, tools are `src/tools.js`. As routes grow, group them in `src/routes/<name>.js` and shared logic in `src/lib/`.
- **Consistent responses:** errors return a clear plain message with the right status (400 bad input, 401/403 not allowed, 404 not found, 500 server error). `/api/chat` streams Server-Sent Events and always ends with `{"type":"done"}`.
- **Validate every input** before using it (request body, tool arguments, webhook payloads).
- **Who is the user?** Read it from the platform's verified sign-in, never from something the browser sends (`security.md`).
- **Webhooks** verify the sender's signature with a secret from `env`.
- **Scheduled jobs** must be safe to re-run (idempotent).
- **Bulk, not loops:** many records in one query or API call, then shape them in code.
- **Secrets** come from `env.NAME`. Never hard-coded.
- **Every new or changed route gets a test** (`testing.md`).
