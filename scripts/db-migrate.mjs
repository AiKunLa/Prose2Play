import "dotenv/config";

import path from "node:path";
import { createRequire } from "node:module";

import { compileDatabaseRuntime } from "./build-database-runtime.mjs";

const root = process.cwd();
const require = createRequire(import.meta.url);

async function main() {
  compileDatabaseRuntime(root);

  const providersEntryPath = path.join(root, "packages", "providers", "dist", "index.js");
  const providerRequire = createRequire(providersEntryPath);
  const { migrate } = providerRequire("drizzle-orm/node-postgres/migrator");
  const configModule = require(path.join(root, "packages", "config", "dist", "index.js"));
  const providersModule = require(providersEntryPath);
  const config = configModule.loadDatabaseConfig(process.env);
  const provider = providersModule.createPostgresDatabaseProvider(config);

  try {
    await migrate(provider.db, {
      migrationsFolder: path.join(root, "packages", "providers", "drizzle"),
    });

    console.log("Database migrations applied successfully.");
  } finally {
    await providersModule.closePostgresDatabaseProvider(provider);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
