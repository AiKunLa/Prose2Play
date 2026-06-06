module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "refactor", "test", "chore", "build", "ci"]
    ],
    "scope-empty": [2, "never"],
    "scope-case": [2, "always", "kebab-case"],
    "subject-empty": [2, "never"],
    "subject-case": [0],
    "header-max-length": [2, "always", 100]
  }
};
