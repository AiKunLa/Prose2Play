import { execSync } from "node:child_process";

const branchPattern = /^(feat|fix|docs|refactor|test|chore)\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const protectedBranches = new Set(["main"]);

function getCurrentBranch() {
  if (process.env.BRANCH_NAME && process.env.BRANCH_NAME.trim()) {
    return process.env.BRANCH_NAME.trim();
  }

  return execSync("git branch --show-current", { encoding: "utf8" }).trim();
}

const branchName = getCurrentBranch();
const allowProtectedBranch = process.env.ALLOW_PROTECTED_BRANCH === "true";

if (protectedBranches.has(branchName)) {
  if (allowProtectedBranch) {
    console.log(`Protected branch '${branchName}' allowed by override.`);
    process.exit(0);
  }

  console.error(`Branch name check failed: direct work on '${branchName}' is not allowed.`);
  console.error("Create a topic branch such as feat/<name>, fix/<name>, docs/<name>, refactor/<name>, test/<name>, or chore/<name>.");
  process.exit(1);
}

if (!branchPattern.test(branchName)) {
  console.error(`Branch name check failed: '${branchName}' does not match the required pattern.`);
  console.error("Expected: feat/<short-name>, fix/<short-name>, docs/<short-name>, refactor/<short-name>, test/<short-name>, or chore/<short-name>.");
  process.exit(1);
}

console.log(`Branch name check passed for '${branchName}'.`);
