import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

// Tests run inside the real Workers runtime (locally, via Miniflare), using the
// same bindings as wrangler.jsonc. Run them with `npm test`.
// `npm run build` runs them, so a failing test stops a broken deploy.
export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.jsonc" },
      miniflare: {
        bindings: {
          // Secrets are always blank in tests, even if a local .dev.vars exists,
          // so tests can never reach a real AI model or outside API. Add every new secret here.
          OPENROUTER_API_KEY: "",
        },
      },
    }),
  ],
  test: {
    include: ["tests/**/*.test.js"],
  },
});
