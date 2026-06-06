import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const root = process.cwd();
const require = createRequire(import.meta.url);
const compiledEntryPath = path.join(root, "packages", "config", "dist", "index.js");

function compileConfigPackage() {
  const tscEntrypoint = path.join(root, "node_modules", "typescript", "bin", "tsc");

  execFileSync(process.execPath, [tscEntrypoint, "-p", "packages/config/tsconfig.json"], {
    cwd: root,
    stdio: "pipe",
  });
}

function loadConfigModule() {
  compileConfigPackage();

  return require(compiledEntryPath);
}

test("loadDatabaseConfig returns a validated database config", () => {
  const configModule = loadConfigModule();
  const config = configModule.loadDatabaseConfig({
    DATABASE_URL: "postgres://postgres:postgres@127.0.0.1:5432/prose2play",
    DATABASE_POOL_MIN: "2",
    DATABASE_POOL_MAX: "10",
    DATABASE_CONNECT_TIMEOUT_MS: "3000",
    DATABASE_IDLE_TIMEOUT_MS: "5000",
    DATABASE_STATEMENT_TIMEOUT_MS: "15000",
    DATABASE_SSL_MODE: "disable",
  });

  assert.deepEqual(config, {
    url: "postgres://postgres:postgres@127.0.0.1:5432/prose2play",
    poolMin: 2,
    poolMax: 10,
    connectTimeoutMs: 3000,
    idleTimeoutMs: 5000,
    statementTimeoutMs: 15000,
    sslMode: "disable",
  });
});

test("loadDatabaseConfig fails fast when DATABASE_URL is missing", () => {
  const configModule = loadConfigModule();

  assert.throws(
    () =>
      configModule.loadDatabaseConfig({
        DATABASE_POOL_MAX: "10",
      }),
    (error) => {
      assert.equal(error.name, "Error");
      assert.match(error.message, /DATABASE_URL/);

      return true;
    },
  );
});

test("loadDatabaseConfig rejects invalid numeric values", () => {
  const configModule = loadConfigModule();

  assert.throws(
    () =>
      configModule.loadDatabaseConfig({
        DATABASE_URL: "postgres://postgres:postgres@127.0.0.1:5432/prose2play",
        DATABASE_POOL_MAX: "zero",
      }),
    (error) => {
      assert.equal(error.name, "Error");
      assert.match(error.message, /DATABASE_POOL_MAX/);

      return true;
    },
  );
});

test("loadDatabaseConfig rejects unsupported ssl modes", () => {
  const configModule = loadConfigModule();

  assert.throws(
    () =>
      configModule.loadDatabaseConfig({
        DATABASE_URL: "postgres://postgres:postgres@127.0.0.1:5432/prose2play",
        DATABASE_SSL_MODE: "sometimes",
      }),
    (error) => {
      assert.equal(error.name, "Error");
      assert.match(error.message, /DATABASE_SSL_MODE/);

      return true;
    },
  );
});
