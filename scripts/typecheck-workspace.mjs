import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const tsconfigFiles = [
  "tsconfig.base.json",
  "tsconfig.json",
  "apps/api/tsconfig.json",
  "apps/web/tsconfig.json",
  "apps/worker/tsconfig.json",
  "packages/config/tsconfig.json",
  "packages/domain/tsconfig.json",
  "packages/pipeline/tsconfig.json",
  "packages/providers/tsconfig.json",
  "packages/schema/tsconfig.json",
  "packages/shared/tsconfig.json"
];

async function ensureJsonFile(relativePath) {
  const absolutePath = path.join(root, relativePath);
  await access(absolutePath);
  const raw = await readFile(absolutePath, "utf8");
  JSON.parse(raw);
}

const errors = [];

for (const file of tsconfigFiles) {
  try {
    await ensureJsonFile(file);
  } catch (error) {
    errors.push(`${file}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (errors.length > 0) {
  console.error("Typecheck configuration validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Typecheck configuration validation passed.");
