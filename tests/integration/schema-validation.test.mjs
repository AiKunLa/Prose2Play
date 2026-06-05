import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const schemaPackageRoot = path.join(root, "packages/schema");
const examplePath = path.join(root, "packages/schema/examples/screenplay-example.yaml");
const invalidFixturePath = path.join(root, "tests/fixtures/invalid-screenplay-missing-source-refs.yaml");

function compileSchemaPackage() {
  const tscEntrypoint = path.join(root, "node_modules", "typescript", "bin", "tsc");

  execFileSync(process.execPath, [tscEntrypoint, "-p", "packages/schema/tsconfig.json"], {
    cwd: root,
    stdio: "pipe",
  });
}

async function loadSchemaModule() {
  compileSchemaPackage();

  return import(pathToFileURL(path.join(schemaPackageRoot, "dist/index.js")).href);
}

test("loadScreenplayYaml reads the example screenplay YAML", async () => {
  const schemaModule = await loadSchemaModule();
  const loaded = await schemaModule.loadScreenplayYaml(examplePath);

  assert.equal(loaded.filePath, examplePath);
  assert.equal(loaded.value.script.id, "script_red_curtain_ep01");
  assert.equal(loaded.value.scenes.length, 2);
});

test("readSchema loads the canonical screenplay JSON Schema", async () => {
  const schemaModule = await loadSchemaModule();
  const schema = await schemaModule.readSchema();

  assert.equal(schema.title, "Prose2Play Screenplay Schema");
  assert.equal(schema.$id, "https://prose2play.local/schemas/screenplay.schema.json");
});

test("validateScreenplay passes for the canonical YAML example", async () => {
  const schemaModule = await loadSchemaModule();
  const loaded = await schemaModule.loadScreenplayYaml(examplePath);
  const result = await schemaModule.validateScreenplay(loaded.value);

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.value?.script.title, "红帘之后");
});

test("validateScreenplayFile returns a readable error for missing scene source_refs", async () => {
  const schemaModule = await loadSchemaModule();
  const result = await schemaModule.validateScreenplayFile(invalidFixturePath);

  assert.equal(result.ok, false);
  assert.equal(result.filePath, invalidFixturePath);
  assert.ok(result.raw.includes("缺少 source_refs"));
  assert.ok(result.errors.length >= 1);
  assert.deepEqual(
    result.errors.map((issue) => issue.path),
    ["$.scenes[0].source_refs"],
  );
  assert.match(result.errors[0].message, /required property/i);
});
