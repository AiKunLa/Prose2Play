import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const root = process.cwd();
const require = createRequire(import.meta.url);
const compiledEntryPath = path.join(root, "packages", "providers", "dist", "index.js");

function compileProvidersPackage() {
  const tscEntrypoint = path.join(root, "node_modules", "typescript", "bin", "tsc");

  execFileSync(process.execPath, [tscEntrypoint, "-b", "packages/config/tsconfig.json", "packages/providers/tsconfig.json"], {
    cwd: root,
    stdio: "pipe",
  });
}

function loadProvidersModule() {
  compileProvidersPackage();

  return require(compiledEntryPath);
}

test("createPostgresDatabaseProvider returns a provider with db and pool handles", async () => {
  const providersModule = loadProvidersModule();
  const provider = providersModule.createPostgresDatabaseProvider({
    url: "postgres://postgres:postgres@127.0.0.1:5432/prose2play",
    poolMin: 0,
    poolMax: 1,
    connectTimeoutMs: 1000,
    idleTimeoutMs: 1000,
    statementTimeoutMs: 1000,
    sslMode: "disable",
  });

  assert.equal(typeof provider, "object");
  assert.equal(typeof provider.pool.query, "function");
  assert.equal(typeof provider.db.select, "function");

  await providersModule.closePostgresDatabaseProvider(provider);
});
