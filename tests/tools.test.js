import { describe, expect, it } from "vitest";
import { runTool, TOOL_DEFINITIONS } from "../src/tools.js";

// Tool tests: every tool gets one. Call it directly with runTool(name, input, env).

describe("tool definitions", () => {
  it("every definition has a handler", async () => {
    for (const def of TOOL_DEFINITIONS) {
      const result = await runTool(def.function.name, {}, {});
      expect(String(result)).not.toContain("Unknown tool");
    }
  });
});

describe("get_current_time", () => {
  it("uses the timezone it is given", async () => {
    const result = await runTool("get_current_time", { timezone: "Australia/Sydney" }, {});
    expect(result.timezone).toBe("Australia/Sydney");
    expect(result.now).toBeTruthy();
  });

  it("defaults to UTC", async () => {
    const result = await runTool("get_current_time", {}, {});
    expect(result.timezone).toBe("UTC");
  });
});

describe("unknown tools", () => {
  it("return a helpful message instead of crashing", async () => {
    const result = await runTool("does_not_exist", {}, {});
    expect(result).toContain("Unknown tool: does_not_exist");
  });
});
