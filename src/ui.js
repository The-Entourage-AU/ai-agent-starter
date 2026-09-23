/**
 * The chat page. A single self-contained HTML string (no build step).
 * A starter UI so you can talk to the agent immediately — restyle or replace it
 * freely. The only contract it relies on is POST /api/chat returning Server-Sent
 * Events (see src/index.js).
 */
export function renderChatPage() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AI Agent</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0; height: 100vh; display: flex; flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0b0b0f; color: #f5f5f7;
    }
    header {
      padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.08);
      display: flex; align-items: center; gap: 10px; flex: 0 0 auto;
    }
    header .dot { width: 8px; height: 8px; border-radius: 50%; background: #34d399; }
    header h1 { margin: 0; font-size: 1rem; font-weight: 600; letter-spacing: -0.01em; }
    header span { color: #71717a; font-size: 0.85rem; }
    #log { flex: 1 1 auto; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
    .msg { max-width: 720px; width: fit-content; line-height: 1.55; white-space: pre-wrap; word-wrap: break-word; }
    .msg.user { align-self: flex-end; background: #2563eb; color: #fff; padding: 12px 16px; border-radius: 16px 16px 4px 16px; }
    .msg.bot { align-self: flex-start; background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 16px 16px 16px 4px; }
    .tool { align-self: flex-start; font-size: 0.8rem; color: #a1a1aa; font-style: italic; padding-left: 4px; }
    .err { align-self: flex-start; color: #f87171; background: rgba(248,113,113,0.1); padding: 10px 14px; border-radius: 12px; font-size: 0.9rem; }
    form { flex: 0 0 auto; display: flex; gap: 10px; padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.08); }
    #input {
      flex: 1; resize: none; background: rgba(255,255,255,0.05); color: #f5f5f7;
      border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 12px 14px;
      font: inherit; max-height: 160px;
    }
    #input:focus { outline: none; border-color: #2563eb; }
    button {
      background: #2563eb; color: #fff; border: 0; border-radius: 12px; padding: 0 20px;
      font: inherit; font-weight: 600; cursor: pointer;
    }
    button:disabled { opacity: 0.5; cursor: default; }
    .empty { margin: auto; text-align: center; color: #52525b; }
    footer { flex: 0 0 auto; text-align: center; color: #3f3f46; font-size: 0.72rem; padding: 6px; }
  </style>
</head>
<body>
  <header>
    <span class="dot"></span>
    <h1>AI Agent</h1>
    <span>powered by AI</span>
  </header>

  <div id="log"><div class="empty">Ask the agent anything to get started.</div></div>

  <form id="form">
    <textarea id="input" rows="1" placeholder="Type a message…  (Enter to send, Shift+Enter for a new line)" autofocus></textarea>
    <button id="send" type="submit">Send</button>
  </form>

  <footer>Built and maintained by Abdo Samy at The Entourage.</footer>

  <script>
    const log = document.getElementById("log");
    const form = document.getElementById("form");
    const input = document.getElementById("input");
    const send = document.getElementById("send");
    const history = []; // [{role, content}] sent to the agent each turn

    function addBubble(cls, text) {
      const el = document.createElement("div");
      el.className = "msg " + cls;
      el.textContent = text;
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
      return el;
    }
    function addNote(cls, text) {
      const el = document.createElement("div");
      el.className = cls;
      el.textContent = text;
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
    }

    input.addEventListener("input", () => {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 160) + "px";
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      document.querySelector(".empty")?.remove();

      addBubble("user", text);
      history.push({ role: "user", content: text });
      input.value = ""; input.style.height = "auto";
      send.disabled = true;

      let bot = null;      // the bot bubble we stream into
      let botText = "";

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });
        if (!res.ok) throw new Error(await res.text());

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\\n\\n");
          buffer = parts.pop();          // keep the incomplete tail
          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith("data:")) continue;
            const event = JSON.parse(line.slice(5).trim());
            if (event.type === "text") {
              if (!bot) bot = addBubble("bot", "");
              botText += event.text;
              bot.textContent = botText;
              log.scrollTop = log.scrollHeight;
            } else if (event.type === "tool") {
              addNote("tool", "using tool: " + event.name + "…");
              bot = null; botText = "";   // next text starts a fresh bubble
            } else if (event.type === "error") {
              addNote("err", event.message);
            }
          }
        }

        if (botText) history.push({ role: "assistant", content: botText });
      } catch (err) {
        addNote("err", err.message || String(err));
      } finally {
        send.disabled = false;
        input.focus();
      }
    });
  </script>
</body>
</html>`;
}
