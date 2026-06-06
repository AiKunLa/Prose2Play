import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";

const root = process.cwd();
const require = createRequire(import.meta.url);
const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function run(command, args, env = process.env) {
  return execFileSync(command, args, {
    cwd: root,
    env,
    shell: process.platform === "win32" && command.endsWith(".cmd"),
    stdio: "pipe",
  }).toString();
}

function loadConfigModule() {
  const compiledEntryPath = path.join(root, "packages", "config", "dist", "index.js");
  return require(compiledEntryPath);
}

function loadProvidersModule() {
  const compiledEntryPath = path.join(root, "packages", "providers", "dist", "index.js");
  return require(compiledEntryPath);
}

test("database foundation scripts migrate an empty database and expose the core tables", async () => {
  const tscEntrypoint = path.join(root, "node_modules", "typescript", "bin", "tsc");
  const workId = randomUUID();
  const jobId = randomUUID();
  const userId = randomUUID();
  const databaseEnv = {
    ...process.env,
    DATABASE_URL: "postgres://postgres:postgres@127.0.0.1:5432/prose2play",
    DATABASE_POOL_MIN: "0",
    DATABASE_POOL_MAX: "10",
    DATABASE_CONNECT_TIMEOUT_MS: "5000",
    DATABASE_IDLE_TIMEOUT_MS: "10000",
    DATABASE_STATEMENT_TIMEOUT_MS: "30000",
    DATABASE_SSL_MODE: "disable",
  };

  run(process.execPath, [tscEntrypoint, "-b", "packages/config/tsconfig.json", "packages/providers/tsconfig.json"]);
  run(pnpmCommand, ["db:migrate"], databaseEnv);
  run(pnpmCommand, ["db:migrate"], databaseEnv);

  const configModule = loadConfigModule();
  const providersModule = loadProvidersModule();
  const config = configModule.loadDatabaseConfig(databaseEnv);
  const provider = providersModule.createPostgresDatabaseProvider(config);

  const tables = await provider.pool.query(`
    select tablename
    from pg_catalog.pg_tables
    where schemaname = 'public'
      and tablename in ('works', 'adaptation_jobs', 'source_chapters')
    order by tablename asc
  `);

  assert.deepEqual(
    tables.rows.map((row) => row.tablename),
    ["adaptation_jobs", "source_chapters", "works"],
  );

  const uniqueConstraint = await provider.pool.query(`
    select count(*)::int as count
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'source_chapters'
      and indexdef ilike '%(job_id, chapter_number)%'
      and indexdef ilike '%unique%'
  `);

  assert.equal(uniqueConstraint.rows[0].count, 1);

  await assert.rejects(
    provider.pool.query(`
      insert into works (id, user_id, title, source_language, created_at, updated_at)
      values ('${workId}', '${userId}', 'Test Work', 'zh-CN', now(), now())
    `)
      .then(() =>
        provider.pool.query(`
          insert into adaptation_jobs (
            id,
            work_id,
            user_id,
            status,
            target_format,
            adaptation_mode,
            start_chapter,
            end_chapter,
            created_at,
            updated_at
          )
          values (
            '${jobId}',
            '${workId}',
            '${userId}',
            'ingested',
            'short_drama',
            'faithful',
            1,
            2,
            now(),
            now()
          )
        `)),
    );

  await providersModule.closePostgresDatabaseProvider(provider);
});

test("db:health succeeds against the configured local PostgreSQL instance", () => {
  const output = run(pnpmCommand, ["db:health"], {
    ...process.env,
    DATABASE_URL: "postgres://postgres:postgres@127.0.0.1:5432/prose2play",
    DATABASE_POOL_MIN: "0",
    DATABASE_POOL_MAX: "10",
    DATABASE_CONNECT_TIMEOUT_MS: "5000",
    DATABASE_IDLE_TIMEOUT_MS: "10000",
    DATABASE_STATEMENT_TIMEOUT_MS: "30000",
    DATABASE_SSL_MODE: "disable",
  });

  assert.match(output, /healthy/i);
});
