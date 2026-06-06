export const DATABASE_SSL_MODES = ["disable", "prefer", "require"] as const;

export type DatabaseSslMode = (typeof DATABASE_SSL_MODES)[number];

export type DatabaseEnvironment = Readonly<Record<string, string | undefined>>;

export interface DatabaseConfig {
  readonly url: string;
  readonly poolMin: number;
  readonly poolMax: number;
  readonly connectTimeoutMs: number;
  readonly idleTimeoutMs: number;
  readonly statementTimeoutMs: number;
  readonly sslMode: DatabaseSslMode;
}

const DEFAULT_POOL_MIN = 0;
const DEFAULT_POOL_MAX = 10;
const DEFAULT_CONNECT_TIMEOUT_MS = 5_000;
const DEFAULT_IDLE_TIMEOUT_MS = 10_000;
const DEFAULT_STATEMENT_TIMEOUT_MS = 30_000;
const DEFAULT_SSL_MODE: DatabaseSslMode = "disable";

function readRequiredString(env: DatabaseEnvironment, key: string): string {
  const value = env[key]?.trim();

  if (value === undefined || value.length === 0) {
    throw new Error(`Missing required database environment variable: ${key}.`);
  }

  return value;
}

function readOptionalInteger(env: DatabaseEnvironment, key: string, defaultValue: number): number {
  const rawValue = env[key];

  if (rawValue === undefined || rawValue.trim().length === 0) {
    return defaultValue;
  }

  const value = Number.parseInt(rawValue, 10);

  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`Database environment variable ${key} must be a non-negative integer.`);
  }

  return value;
}

function readSslMode(env: DatabaseEnvironment): DatabaseSslMode {
  const rawValue = env.DATABASE_SSL_MODE?.trim();

  if (rawValue === undefined || rawValue.length === 0) {
    return DEFAULT_SSL_MODE;
  }

  if (!DATABASE_SSL_MODES.includes(rawValue as DatabaseSslMode)) {
    throw new Error(
      `Database environment variable DATABASE_SSL_MODE must be one of: ${DATABASE_SSL_MODES.join(", ")}.`,
    );
  }

  return rawValue as DatabaseSslMode;
}

export function loadDatabaseConfig(env: DatabaseEnvironment = process.env): DatabaseConfig {
  const poolMin = readOptionalInteger(env, "DATABASE_POOL_MIN", DEFAULT_POOL_MIN);
  const poolMax = readOptionalInteger(env, "DATABASE_POOL_MAX", DEFAULT_POOL_MAX);

  if (poolMax < poolMin) {
    throw new Error("Database environment variable DATABASE_POOL_MAX must be greater than or equal to DATABASE_POOL_MIN.");
  }

  return Object.freeze({
    url: readRequiredString(env, "DATABASE_URL"),
    poolMin,
    poolMax,
    connectTimeoutMs: readOptionalInteger(env, "DATABASE_CONNECT_TIMEOUT_MS", DEFAULT_CONNECT_TIMEOUT_MS),
    idleTimeoutMs: readOptionalInteger(env, "DATABASE_IDLE_TIMEOUT_MS", DEFAULT_IDLE_TIMEOUT_MS),
    statementTimeoutMs: readOptionalInteger(
      env,
      "DATABASE_STATEMENT_TIMEOUT_MS",
      DEFAULT_STATEMENT_TIMEOUT_MS,
    ),
    sslMode: readSslMode(env),
  });
}
