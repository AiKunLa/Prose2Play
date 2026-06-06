export interface AppConfig {
  readonly appName: string;
}

export {
  DATABASE_SSL_MODES,
  type DatabaseConfig,
  type DatabaseEnvironment,
  type DatabaseSslMode,
  loadDatabaseConfig,
} from "./database-config.js";
