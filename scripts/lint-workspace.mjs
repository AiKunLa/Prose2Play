import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const requiredRootFiles = [
  "README.md",
  "AGENTS.md",
  "package.json",
  "pnpm-workspace.yaml",
  "docs/index.md"
];

const requiredPackages = [
  "config",
  "domain",
  "pipeline",
  "providers",
  "schema",
  "shared"
];

async function exists(relativePath) {
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function readJson(relativePath) {
  const content = await readFile(path.join(root, relativePath), "utf8");
  return JSON.parse(content);
}

const errors = [];

for (const file of requiredRootFiles) {
  if (!(await exists(file))) {
    errors.push(`Missing root file: ${file}`);
  }
}

for (const pkg of requiredPackages) {
  const base = `packages/${pkg}`;
  for (const file of ["README.md", "AGENTS.md", "package.json"]) {
    if (!(await exists(`${base}/${file}`))) {
      errors.push(`Missing package file: ${base}/${file}`);
    }
  }
}

const rootPackage = await readJson("package.json");
if (rootPackage.packageManager !== "pnpm@10.12.1") {
  errors.push("Root packageManager must be pnpm@10.12.1");
}

for (const app of ["api", "web", "worker"]) {
  const packageJsonPath = `apps/${app}/package.json`;
  if (!(await exists(packageJsonPath))) {
    errors.push(`Missing app package: ${packageJsonPath}`);
    continue;
  }

  const appPackage = await readJson(packageJsonPath);
  if (!String(appPackage.name || "").startsWith("@prose2play/")) {
    errors.push(`App package name must start with @prose2play/: ${packageJsonPath}`);
  }
}

for (const pkg of requiredPackages) {
  const packageJsonPath = `packages/${pkg}/package.json`;
  const packageJson = await readJson(packageJsonPath);
  if (!String(packageJson.name || "").startsWith("@prose2play/")) {
    errors.push(`Package name must start with @prose2play/: ${packageJsonPath}`);
  }
}

const packagesDir = await readdir(path.join(root, "packages"), { withFileTypes: true });
for (const entry of packagesDir) {
  if (!entry.isDirectory()) {
    continue;
  }
  if (!requiredPackages.includes(entry.name)) {
    errors.push(`Unexpected package directory without explicit rules: packages/${entry.name}`);
  }
}

if (errors.length > 0) {
  console.error("Workspace lint failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Workspace lint passed.");
