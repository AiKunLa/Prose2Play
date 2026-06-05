import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const schemaPath = path.join(root, "packages/schema/schemas/screenplay.schema.json");
const examplesDir = path.join(root, "packages/schema/examples");

const errors = [];

try {
  const raw = await readFile(schemaPath, "utf8");
  const schema = JSON.parse(raw);
  if (schema.title !== "Prose2Play Screenplay Schema") {
    errors.push("Schema title must remain 'Prose2Play Screenplay Schema'");
  }
  if (!schema.$defs || !schema.properties || !schema.required) {
    errors.push("Schema is missing required top-level sections");
  }
} catch (error) {
  errors.push(`Schema parse failed: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  await access(examplesDir);
  const entries = await readdir(examplesDir);
  const yamlEntries = entries.filter((entry) => entry.endsWith(".yaml") || entry.endsWith(".yml"));
  if (yamlEntries.length === 0) {
    errors.push("At least one YAML example is required in packages/schema/examples");
  }

  for (const file of yamlEntries) {
    const content = await readFile(path.join(examplesDir, file), "utf8");
    const requiredSnippets = ["schema_version:", "script:", "source:", "adaptation:", "scenes:"];
    for (const snippet of requiredSnippets) {
      if (!content.includes(snippet)) {
        errors.push(`Example ${file} is missing required snippet: ${snippet}`);
      }
    }
  }
} catch (error) {
  errors.push(`Schema examples check failed: ${error instanceof Error ? error.message : String(error)}`);
}

if (errors.length > 0) {
  console.error("Schema check failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Schema check passed.");
