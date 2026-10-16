---
paths:
  - "migrations/**"
  - "wrangler.jsonc"
---

# Database standards (Cloudflare D1, optional)

- **No `d1_databases` binding in `wrangler.jsonc` = no database yet.** It ships off. Creating one is a "Stop and ask" (`boundaries.md`); `migrations/README.md` has the owner's steps.
- Change the schema only through new migration files: `migrations/NNNN_short_description.sql` (e.g. `0002_add_status_to_orders.sql`). **Never edit a migration that has already been applied.**
- How migrations go live here: `npm run migrate` (`wrangler d1 migrations apply DB --remote`) after the push. The owner runs it, or approves Claude running it.
- **Naming:** tables plural `snake_case` (`orders`), columns `snake_case` (`created_at`). Every table has an `id` primary key and a `created_at` column.
- **Prefer non-destructive changes:** add a column rather than rename or drop.
- **Destructive changes** (DROP, deleting or overwriting data): tell the owner in plain words exactly what data will be lost, and get a clear "yes" first.
- Parameterised queries only (`env.DB.prepare(...).bind(...)`), never string-built SQL.
- Batch reads and writes (`env.DB.batch([...])`) instead of one query per record.
- When the database is turned on: add `readD1Migrations` + `tests/apply-migrations.js` to the test setup so tests run against the real schema.
- Record the data model in `docs/ARCHITECTURE.md` whenever the schema changes.
