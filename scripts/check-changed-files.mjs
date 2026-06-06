import { readFile } from "node:fs/promises";

async function getChangedFiles() {
  if (process.env.CHANGED_FILES_PATH) {
    const content = await readFile(process.env.CHANGED_FILES_PATH, "utf8");
    return content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  if (process.env.CHANGED_FILES) {
    return process.env.CHANGED_FILES
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  return process.argv.slice(2).map((line) => line.trim()).filter(Boolean);
}

const changedFiles = await getChangedFiles();

if (changedFiles.length === 0) {
  console.log("Changed files guard passed: no changed files provided.");
  process.exit(0);
}

const hasPathPrefix = (prefix) => changedFiles.some((file) => file.startsWith(prefix));
const hasExactPath = (filePath) => changedFiles.includes(filePath);

const errors = [];

if (hasPathPrefix("packages/schema/schemas/")) {
  if (!hasPathPrefix("packages/schema/examples/")) {
    errors.push("Schema changes must include at least one example update under packages/schema/examples/.");
  }

  if (!hasExactPath("docs/2-CORE-CONCEPTS/screenplay-yaml-model.md")) {
    errors.push("Schema changes must update docs/2-CORE-CONCEPTS/screenplay-yaml-model.md.");
  }

  if (!hasExactPath("docs/8-REFERENCE/json-schema-reference.md")) {
    errors.push("Schema changes must update docs/8-REFERENCE/json-schema-reference.md.");
  }
}

if (hasPathPrefix(".github/workflows/") || hasExactPath("commitlint.config.cjs") || hasPathPrefix(".husky/")) {
  if (!hasExactPath("docs/7-DEVELOPMENT/git-automation-workflow.md")) {
    errors.push("Git automation changes must update docs/7-DEVELOPMENT/git-automation-workflow.md.");
  }
}

if (errors.length > 0) {
  console.error("Changed files guard failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Changed files guard passed.");
