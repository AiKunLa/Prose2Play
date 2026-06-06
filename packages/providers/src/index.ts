export interface ProviderHealth {
  readonly provider: string;
  readonly healthy: boolean;
}

export {
  closePostgresDatabaseProvider,
  createPostgresDatabaseProvider,
  checkPostgresProviderHealth,
} from "./database/postgres/index.js";
export {
  adaptationJobs,
  sourceChapters,
  works,
} from "./database/postgres/schema.js";
