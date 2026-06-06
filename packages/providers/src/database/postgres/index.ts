import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { DatabaseConfig } from "@prose2play/config";

import { adaptationJobs, sourceChapters, works } from "./schema.js";

const postgresSchema = {
  adaptationJobs,
  sourceChapters,
  works,
};

export interface PostgresDatabaseProvider {
  readonly db: NodePgDatabase<typeof postgresSchema>;
  readonly pool: Pool;
}

function resolveSslConfig(config: DatabaseConfig): false | { rejectUnauthorized: boolean } {
  if (config.sslMode === "disable") {
    return false;
  }

  return {
    rejectUnauthorized: config.sslMode === "require",
  };
}

export function createPostgresDatabaseProvider(config: DatabaseConfig): PostgresDatabaseProvider {
  const pool = new Pool({
    connectionString: config.url,
    idleTimeoutMillis: config.idleTimeoutMs,
    max: config.poolMax,
    min: config.poolMin,
    ssl: resolveSslConfig(config),
    statement_timeout: config.statementTimeoutMs,
    connectionTimeoutMillis: config.connectTimeoutMs,
  });

  return Object.freeze({
    db: drizzle(pool, { schema: postgresSchema }),
    pool,
  });
}

export async function closePostgresDatabaseProvider(provider: PostgresDatabaseProvider): Promise<void> {
  await provider.pool.end();
}

export async function checkPostgresProviderHealth(provider: PostgresDatabaseProvider): Promise<{
  readonly provider: string;
  readonly healthy: boolean;
}> {
  try {
    await provider.pool.query("select 1");

    return {
      provider: "postgres",
      healthy: true,
    };
  } catch {
    return {
      provider: "postgres",
      healthy: false,
    };
  }
}
