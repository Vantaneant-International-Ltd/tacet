import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

// Tests run inside the Workers runtime (workerd) with real local D1 + R2 bindings,
// so API-route and auth tests exercise the actual worker, not a mock.
export default defineWorkersConfig({
  test: {
    include: ["test/**/*.test.ts"],
    poolOptions: {
      workers: {
        singleWorker: true,
        wrangler: { configPath: "./wrangler.jsonc" },
        miniflare: {
          // D1 migrations are applied per-test-run in test/setup via applyD1Migrations.
          compatibilityDate: "2025-01-01",
          compatibilityFlags: ["nodejs_compat"],
        },
      },
    },
  },
});
