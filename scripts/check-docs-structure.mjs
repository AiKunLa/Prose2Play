import { access } from "node:fs/promises";

const required = [
  "README.md",
  "docs/index.md",
  "docs/0-START-HERE/index.md",
  "docs/1-INSTALLATION/index.md",
  "docs/2-CORE-CONCEPTS/index.md",
  "docs/3-USER-GUIDE/index.md",
  "docs/4-PROVIDERS/index.md",
  "docs/5-CONFIGURATION/index.md",
  "docs/6-TROUBLESHOOTING/index.md",
  "docs/7-DEVELOPMENT/index.md",
  "docs/8-REFERENCE/index.md",
  "packages/schema/schemas/screenplay.schema.json"
];

const missing = [];

for (const file of required) {
  try {
    await access(new URL(`../${file}`, import.meta.url));
  } catch {
    missing.push(file);
  }
}

if (missing.length > 0) {
  console.error("Missing required documentation files:");
  for (const file of missing) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log("Documentation structure looks complete.");
