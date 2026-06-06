import { loadDatabaseConfig, type DatabaseEnvironment } from "@prose2play/config";
import { createPostgresDatabaseProvider } from "@prose2play/providers";

export function createWorkerDatabaseSmokeCheck(env: DatabaseEnvironment = process.env) {
  const config = loadDatabaseConfig(env);

  return createPostgresDatabaseProvider(config);
}
