/**
 * AI Agent — Worker entry point.
 *
 * Two routes:
 *   GET  /          → the chat UI (a single page).
 *   POST /api/chat  → runs the agent and streams the reply back (SSE).
 *
 * This starter ships as a chat agent because it's the easiest to test. To reach
 * the agent another way (an email/Slack/webhook coming in, or a schedule), add a
 * route here that receives the input and calls runAgent — the loop and tools stay
 * the same. See CLAUDE.md Section 5.
 *
 * Keep this file about routing. The agent's logic lives in src/agent.js and its
 * tools in src/tools.js.
 */

import { runAgent } from "./agent.js";
import { renderChatPage } from "./ui.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(renderChatPage(), {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    if (request.method === "POST" && url.pathname === "/api/chat") {
      return handleChat(request, env);
    }

    return new Response("Not found", { status: 404 });
  },
};

async function handleChat(request, env) {
  let messages;
  try {
    const body = await request.json();
    messages = body.messages;
    if (!Array.isArray(messages)) throw new Error("`messages` must be an array");
  } catch (err) {
    return new Response(`Bad request: ${err.message}`, { status: 400 });
  }

  // Stream the agent's output to the browser as it is produced (Server-Sent Events).
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      try {
        await runAgent({ messages, env, emit: send });
      } catch (err) {
        send({ type: "error", message: err?.message ?? String(err) });
      } finally {
        send({ type: "done" });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache",
      connection: "keep-alive",
    },
  });
}
