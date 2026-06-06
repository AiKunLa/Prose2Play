import { readFile } from "node:fs/promises";

const requiredSections = ["## 标题", "## 功能描述", "## 实现思路", "## 测试方式"];

async function getBody() {
  if (process.env.PR_BODY_PATH) {
    return readFile(process.env.PR_BODY_PATH, "utf8");
  }

  return process.env.PR_BODY || process.argv.slice(2).join(" ");
}

const body = await getBody();

if (!body || !body.trim()) {
  console.error("PR body check failed: body is empty.");
  process.exit(1);
}

const missing = requiredSections.filter((section) => !body.includes(section));

if (missing.length > 0) {
  console.error("PR body check failed: missing required sections.");
  for (const section of missing) {
    console.error(`- ${section}`);
  }
  process.exit(1);
}

console.log("PR body check passed.");
