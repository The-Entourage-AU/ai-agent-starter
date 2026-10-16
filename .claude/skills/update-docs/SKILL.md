---
name: update-docs
description: Sweep the project docs so the next Claude session knows what changed. Use at the end of a work session, after shipping a feature, or when the user says "update the docs", "wrap up" or "save progress".
---

# Update the project docs

Keep `docs/` as the project's source of truth. Be brief: update what changed, nothing more.

1. **See what changed.** Check `git log` and `git diff` since `docs/CURRENT-STATE.md` was last updated, plus anything decided in this conversation.
2. **Update each doc only if it's affected:**
   - `docs/CURRENT-STATE.md`: refresh 🚦 At a glance; move finished work to ✅ Live; update 🚧 In progress, 🔜 Next, ⏳ Waiting on, 🐞 Known issues. Set "Last updated" to today.
   - `docs/ARCHITECTURE.md`: new or changed screens, routes, tables, data flows. Replace any [placeholders] you now know.
   - `docs/DECISIONS.md`: add an entry (newest at top) for any real choice between options: what, why, options rejected. Add a row to 📋 Summary.
   - `docs/INTEGRATIONS.md`: new outside services, bindings, secret **names**.
   - `docs/RUNBOOK.md`: any error you fixed that could happen again.
3. **Check for contradictions** between the docs and the code. The code wins; fix the doc.
4. **Never write secrets** into any doc.
5. Run the checks, commit with a message like `Update project docs`, and push the way this project ships (`CLAUDE.md` Section 4).
6. Tell the owner in one line which docs you updated.
