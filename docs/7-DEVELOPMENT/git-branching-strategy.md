# 分支开发规范

## 目标

本项目采用轻量分支开发模式，保证：

- 主分支始终可用
- 每次改动边界清晰
- 功能、规则、文档、重构不混在同一个 PR 中

## 基本原则

### 1. 所有新功能通过 PR 合并

- 功能开发不直接提交到主分支
- 修复、重构、文档专项修改也优先走 PR

### 2. 一个分支只做一件事

- 一个分支只承载一个明确目标
- 不在同一个分支混入功能、重构、文档大改和无关修复

### 3. 主分支始终可检查

合并前应确保：

- `pnpm lint` 通过
- `pnpm typecheck` 通过
- `pnpm test` 通过
- `pnpm schema:check` 通过

## 分支命名规范

### 功能分支

- `feat/<short-topic>`
- `fix/<short-topic>`
- `docs/<short-topic>`
- `refactor/<short-topic>`
- `test/<short-topic>`
- `chore/<short-topic>`

### 命名要求

- 使用短横线连接短语
- 名称描述“结果”而不是“过程”
- 保持简洁，不超过 3 到 5 个词组

### 示例

- `feat/create-adaptation-job`
- `fix/schema-check-paths`
- `docs/add-pr-guidelines`
- `chore/bootstrap-monorepo`

## 适合 Prose2Play 的拆分方式

### 推荐按以下边界拆分分支

- 文档体系建设
- monorepo 基础骨架
- 仓库规则和检查工具
- schema 与示例
- API 初始能力
- Worker 初始能力
- Web 初始能力

### 不推荐的拆法

- 一个分支同时改文档、后端 API、Worker、前端页面和 Provider 接入

## 特殊说明：项目初始化阶段

当前仓库仍处于基础设施和规范搭建阶段，允许少量“初始化型分支”，例如：

- `chore/bootstrap-monorepo`
- `docs/documentation-foundation`
- `chore/repository-rules`

但即使在初始化阶段，也应尽量按专题拆分，不把后续业务功能混入初始化提交。
