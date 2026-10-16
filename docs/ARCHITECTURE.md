# Architecture

> How the app works. Claude keeps it current. `[brackets]` = not filled in yet.

## 🎯 Purpose
- **Problem it solves:** a ready-to-build starting point for any AI agent that talks to a model, uses tools and does a real job for a business. [Owner: the real job of your agent]
- **Who uses it:** [who talks to the agent, and how]
- **Owner:** [owner name]

## 🗺️ The flow
```
Browser chat page  →  POST /api/chat (messages)  →  src/agent.js  →  OpenRouter model
                                                         ↕ tool calls
                                                     src/tools.js  →  (optional) D1 / outside APIs
           ←  Server-Sent Events: text, tool, error, done  ←
```
The browser sends the whole conversation each turn, so the Worker keeps no memory between requests. The agent streams text as it arrives; when the model asks for a tool, the loop runs it, feeds the result back and continues, up to `MAX_STEPS` (10) round-trips.

## 🖥️ Screens
| Screen | What it does | File |
|---|---|---|
| Chat page | Type a message, see the streamed reply and which tools ran | `src/ui.js` |

## 🛣️ Routes
| Method + path | What it does | Who can call it |
|---|---|---|
| `GET /` | Serves the chat page | Anyone with the URL (no sign-in yet) |
| `POST /api/chat` | Body `{ messages: [{role, content}] }`. Runs the agent and streams SSE events `text`, `tool`, `error`, `done`. 400 on bad JSON or a missing `messages` array | Anyone with the URL (no sign-in yet) |
| anything else | 404 | |

## 🗄️ Data model
No database yet. D1 is off by default (`migrations/README.md`, `wrangler.jsonc`).

## 🤖 Agent tools
| Tool | What it does | Changes data? |
|---|---|---|
| `get_current_time` | Current date and time in an IANA timezone (default UTC) | No |
| `search_records` (commented out) | Example D1 search, up to 10 matches by name | No |
