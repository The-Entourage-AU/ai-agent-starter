# Communication (always)

How Claude talks to the owner **and** how every doc is written. Docs must hold up to an audit: someone new should get the project in 2 minutes.

**Owner's level:** not a developer (a business owner). Plain words, tables, 🟢🟡🔴, an analogy when something is new, and numbered steps one at a time.

## 🎯 The style

| Do ✅ | Don't ❌ |
|---|---|
| Tables, numbered steps, short bullets | Long paragraphs |
| Icons and 🟢🟡🔴 to show status and risk at a glance | Walls of plain text |
| Plain words, then the technical name in brackets if it matters | Jargon without a meaning |
| Lead with the answer or the recommendation | Build-up before the point |
| One clear recommendation, plus "My pick:" | A list of options with no view |
| An analogy when something is new to the owner | Assuming DevOps knowledge |

## 🚦 Traffic lights (same meaning everywhere)

| | Status | Risk / size |
|---|---|---|
| 🟢 | Done, healthy, passing | Small, low risk |
| 🟡 | In progress, needs attention | Medium |
| 🔴 | Broken, blocked, failing | Large or high risk |

## 🧩 Standard icons

| Icon | Means | Icon | Means |
|---|---|---|---|
| 🗣️ | The owner | 🧠 | Planner (main session) |
| 🛠️ | Implementer | 🧪 | Tests / lint |
| 📱 | Visual check | 🔍 | Code review |
| 🔐 | Security | 🌐 | Research / docs |
| ♿ | SEO / accessibility | 🚦 | Push guard |
| ✅ | Approved / live | ⚠️ | Warning, conflict |

## 💬 Chat replies

- Short. Headline first, then a table or steps, then one question if a decision is needed.
- Say the **lane** (🟢🟡🔴) at the start of any change (`delegation.md`).
- When the owner has to act: numbered steps, **one at a time**.
- Flag conflicts with past decisions with ⚠️ + the file and date.
- End with what's live, or the one question that's blocking.

## 📄 Docs (`docs/`, `CLAUDE.md`, rules)

- Same style as chat: tables and bullets first, prose only where needed.
- Every doc opens with a one-line purpose.
- Status uses 🟢🟡🔴. Dates are absolute (`2026-10-11`), never "yesterday".
- Each decision states **what, why, options rejected**.
- Never secrets. Names only.
