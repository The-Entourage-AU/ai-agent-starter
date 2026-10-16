import { exports } from "cloudflare:workers";
import { describe, expect, it } from "vitest";
import "../src/index.js"; // re-run tests when the Worker changes

// API tests: call the Worker the same way the browser does and check the answer.
// These never call the real model: OPENROUTER_API_KEY is blank in vitest.config.js.

const chat = (body) =>
  exports.default.fetch("http://app/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

describe("GET /", () => {
  it("serves the chat page", async () => {
    const res = await exports.default.fetch("http://app/");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
  });
});

describe("POST /api/chat", () => {
  it("rejects a body without a messages array", async () => {
    const res = await chat({ messages: "hi" });
    expect(res.status).toBe(400);
  });

  it("rejects invalid JSON", async () => {
    const res = await chat("not json");
    expect(res.status).toBe(400);
  });

  it("streams a clear error when OPENROUTER_API_KEY is not set", async () => {
    const res = await chat({ messages: [{ role: "user", content: "hi" }] });
    expect(res.headers.get("content-type")).toContain("text/event-stream");
    const text = await res.text();
    expect(text).toContain("OPENROUTER_API_KEY is not set");
    expect(text).toContain('"type":"done"');
  });
});

describe("unknown routes", () => {
  it("return 404", async () => {
    const res = await exports.default.fetch("http://app/nope");
    expect(res.status).toBe(404);
  });
});
