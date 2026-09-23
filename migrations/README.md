# Database migrations (optional)

Your agent works **without** a database. Add one only when it needs to *remember*
things (past conversations, saved results) or *look up* data (customers, records,
a knowledge base) to do its job.

## Turn a database on

1. Create one in your own Cloudflare account:
   ```bash
   npx wrangler d1 create your-db-name
   ```
2. Copy the `database_id` it prints into `wrangler.jsonc` (uncomment the
   `d1_databases` block) — that ID is **not** a secret and is safe to commit.
3. Add a migration file here (see below), then apply it:
   ```bash
   npx wrangler d1 migrations apply DB --remote
   ```
4. Add a tool in `src/tools.js` that queries the database (there's a commented
   example there).

Or just ask Claude to do all of this for you.

## How migrations work

- Each change is a new `.sql` file, numbered in order:
  `0001_init.sql`, `0002_add_column.sql`, ...
- Applying runs any new files in order.

## Example first migration (`0001_init.sql`)

```sql
CREATE TABLE IF NOT EXISTS records (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

## Safety

**Deleting** a table or column loses data permanently. Claude will warn you and
ask you to confirm before writing anything destructive. Prefer adding a new column
over renaming or dropping one.

---

*Keep this file here so the folder stays in the repo even when empty.*
