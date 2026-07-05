import { defineWorkersConfig, readD1Migrations } from "@cloudflare/vitest-pool-workers/config";

// Tests run inside the Workers runtime (workerd) with real local D1 + R2 bindings, so
// API-route and auth tests exercise the actual worker, not a mock. Migrations are read
// here and applied to each test's isolated D1 in test/apply-migrations.ts.
const migrations = await readD1Migrations("./migrations");

export default defineWorkersConfig({
  test: {
    include: ["test/**/*.test.ts"],
    setupFiles: ["./test/apply-migrations.ts"],
    poolOptions: {
      workers: {
        singleWorker: true,
        wrangler: { configPath: "./wrangler.jsonc" },
        miniflare: {
          compatibilityFlags: ["nodejs_compat"],
          bindings: { TEST_MIGRATIONS: migrations },
        },
      },
    },
  },
});
