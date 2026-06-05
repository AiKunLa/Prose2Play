import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

async function fileExists(relativePath) {
  await access(path.join(root, relativePath));
}

test("root documentation entry points exist", async () => {
  await fileExists("README.md");
  await fileExists("docs/index.md");
  await fileExists("AGENTS.md");
});

test("all packages have local README and AGENTS rules", async () => {
  const packages = ["config", "domain", "pipeline", "providers", "schema", "shared"];

  for (const pkg of packages) {
    await fileExists(`packages/${pkg}/README.md`);
    await fileExists(`packages/${pkg}/AGENTS.md`);
    await fileExists(`packages/${pkg}/package.json`);
  }
});

test("schema package keeps the canonical schema file", async () => {
  const raw = await readFile(path.join(root, "packages/schema/schemas/screenplay.schema.json"), "utf8");
  const schema = JSON.parse(raw);
  assert.equal(schema.title, "Prose2Play Screenplay Schema");
});
