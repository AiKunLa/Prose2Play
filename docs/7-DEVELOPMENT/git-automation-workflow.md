# Git 与 PR 自动化流程

## 目标

本项目通过本地 hooks 与 GitHub Actions 共同保证：

- 分支命名符合规范
- commit 信息符合 Conventional Commits
- PR 标题和描述完整
- 主分支合并前通过 `pnpm check`
- Schema 与文档联动不被遗漏

## 本地自动化

### Husky hooks

- `.husky/pre-commit`
  - 运行 `pnpm lint`
- `.husky/commit-msg`
  - 运行 `pnpm commitlint --edit "$1"`
- `.husky/pre-push`
  - 运行 `pnpm branch:check`
  - 运行 `pnpm check`

### 本地脚本

- `pnpm branch:check`
- `pnpm commitlint`
- `pnpm pr:title:check`
- `pnpm pr:body:check`
- `pnpm changes:guard`

## GitHub Actions

### branch-and-pr-policy

负责检查：

- 分支命名
- PR 标题格式
- PR 描述必填部分

### ci-check

负责运行：

- `pnpm install --frozen-lockfile`
- `pnpm check`

### changed-files-guard

负责检查：

- Schema 改动是否同步更新示例和参考文档
- Git 自动化改动是否同步更新本说明文档

## 手动 GitHub 设置

以下设置需要在 GitHub 仓库设置中手动开启：

### Branch protection for `main`

- Require a pull request before merging
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Restrict direct pushes to `main`
- Require review from code owners（如果启用 CODEOWNERS）

### Required status checks

建议设为必选：

- `branch-and-pr-policy`
- `ci-check`
- `changed-files-guard`

## 说明

GitHub MCP server 可以帮助读取仓库内容、创建 PR、更新远程文件等，但像 branch protection 这类仓库设置仍需在 GitHub UI 中完成。
