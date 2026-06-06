const title = (process.env.PR_TITLE || process.argv.slice(2).join(" ")).trim();
const titlePattern = /^(feat|fix|docs|refactor|test|chore|build|ci)\([a-z0-9]+(?:-[a-z0-9]+)*\): .+$/;

if (!title) {
  console.error("PR title check failed: title is empty.");
  process.exit(1);
}

if (!titlePattern.test(title)) {
  console.error(`PR title check failed: '${title}' does not match '<type>(<scope>): <summary>'.`);
  process.exit(1);
}

console.log("PR title check passed.");
