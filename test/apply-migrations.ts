import { applyD1Migrations, env } from "cloudflare:test";

// Runs before each test file's tests. With isolated storage, every test starts from a
// migrated but empty database.
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
