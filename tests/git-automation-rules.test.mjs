import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

async function fileExists(relativePath) {
  await access(path.join(root, relativePath));
}

test("git automation files exist", async () => {
  await fileExists("commitlint.config.cjs");
  await fileExists(".github/CODEOWNERS");
  await fileExists(".github/workflows/branch-and-pr-policy.yml");
  await fileExists(".github/workflows/ci-check.yml");
  await fileExists(".github/workflows/changed-files-guard.yml");
  await fileExists(".husky/pre-commit");
  await fileExists(".husky/commit-msg");
  await fileExists(".husky/pre-push");
});

test("package.json exposes automation scripts", async () => {
  const raw = await readFile(path.join(root, "package.json"), "utf8");
  const packageJson = JSON.parse(raw);

  assert.equal(packageJson.scripts["branch:check"], "node scripts/check-branch-name.mjs");
  assert.equal(packageJson.scripts["pr:title:check"], "node scripts/check-pr-title.mjs");
  assert.equal(packageJson.scripts["pr:body:check"], "node scripts/check-pr-body.mjs");
  assert.equal(packageJson.scripts["changes:guard"], "node scripts/check-changed-files.mjs");
});
