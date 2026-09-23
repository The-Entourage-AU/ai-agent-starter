/**
 * The agent's tools.
 *
 * A "tool" is something the AI can choose to run to get information or take an
 * action. Each tool has TWO parts that must stay in sync:
 *   1. A DEFINITION in TOOL_DEFINITIONS — tells the model the tool exists, what
 *      it does, and what inputs it takes (OpenAI/OpenRouter format).
 *   2. A HANDLER in `handlers` — the actual code that runs.
 *
 * To add a tool: add one entry to each. The loop in agent.js does the rest. Keep
 * tools small and single-purpose; the description is how the model decides when
 * to use one. This is where you'll do most of your building.
 */

// ── 1) DEFINITIONS (what the model sees) ────────────────────────────────────
export const TOOL_DEFINITIONS = [
  {
    type: "function",
    function: {
      name: "get_current_time",
      description:
        "Get the current date and time. Use when the user asks what time or day it is, or when you need 'now' to reason about scheduling.",
      parameters: {
        type: "object",
        properties: {
          timezone: {
            type: "string",
            description: "IANA timezone, e.g. 'Australia/Sydney' or 'UTC'. Defaults to UTC.",
          },
        },
        required: [],
      },
    },
  },

  // ── EXAMPLE: a data tool (commented out) ─────────────────────────────────
  // Uncomment once a D1 database is bound in wrangler.jsonc (see migrations/).
  // This is the pattern for giving the agent real data.
  //
  // {
  //   type: "function",
  //   function: {
  //     name: "search_records",
  //     description: "Search records by name. Returns up to 10 matches.",
  //     parameters: {
  //       type: "object",
  //       properties: {
  //         query: { type: "string", description: "Name or part of a name to search for." },
  //       },
  //       required: ["query"],
  //     },
  //   },
  // },
];

// ── 2) HANDLERS (what actually runs) ────────────────────────────────────────
const handlers = {
  async get_current_time(input) {
    const timezone = input?.timezone || "UTC";
    const now = new Date().toLocaleString("en-GB", {
      timeZone: timezone,
      dateStyle: "full",
      timeStyle: "short",
    });
    return { timezone, now };
  },

  // async search_records(input, env) {
  //   // Bulk query, never a loop — one round-trip to the database.
  //   const { results } = await env.DB
  //     .prepare("SELECT name, email FROM records WHERE name LIKE ? LIMIT 10")
  //     .bind(`%${input.query}%`)
  //     .all();
  //   return results;
  // },
};

/**
 * Dispatch a tool call to its handler. Called by the agent loop.
 * @param {string} name   Tool name the model requested.
 * @param {object} input  Arguments the model supplied (already parsed).
 * @param {object} env    Worker env (secrets + bindings like env.DB).
 */
export async function runTool(name, input, env) {
  const handler = handlers[name];
  if (!handler) {
    return `Unknown tool: ${name}. Available: ${Object.keys(handlers).join(", ")}.`;
  }
  return handler(input, env);
}
