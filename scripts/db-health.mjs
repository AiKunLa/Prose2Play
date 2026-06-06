import "dotenv/config";

import path from "node:path";
import { createRequire } from "node:module";

import { compileDatabaseRuntime } from "./build-database-runtime.mjs";

const root = process.cwd();
const require = createRequire(import.meta.url);

async function main() {
  compileDatabaseRuntime(root);

  const configModule = require(path.join(root, "packages", "config", "dist", "index.js"));
  const providersModule = require(path.join(root, "packages", "providers", "dist", "index.js"));
  const config = configModule.loadDatabaseConfig(process.env);
  const provider = providersModule.createPostgresDatabaseProvider(config);

  try {
    const health = await providersModule.checkPostgresProviderHealth(provider);

    if (!health.healthy) {
      throw new Error("PostgreSQL provider health check failed.");
    }

    console.log("PostgreSQL provider is healthy.");
  } finally {
    await providersModule.closePostgresDatabaseProvider(provider);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
