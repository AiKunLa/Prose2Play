# Prose2Play

Prose2Play 是一个面向小说作者、编辑和内容团队的 AI 辅助改编平台，用于把连续 3 章以上的小说文本转换为结构化 YAML 剧本初稿。

## 它解决什么问题

- 降低小说改编剧本的门槛
- 为作者提供可编辑、可追溯、可继续打磨的剧本骨架
- 为后续编辑器、导出器、审校器提供稳定的数据结构

## 仓库类型

这是一个 `pnpm monorepo`：

- `apps/`：可运行应用，例如 `web`、`api`、`worker`
- `packages/`：共享领域模型、生成流程、Provider 适配、Schema 和配置
- `docs/`：渐进式文档体系

## 最短阅读路径

1. 先看 [docs/index.md](D:/Code/VSCode_Project/Prose2Play/docs/index.md)
2. 如果你是第一次接触项目，继续看 [docs/0-START-HERE/index.md](D:/Code/VSCode_Project/Prose2Play/docs/0-START-HERE/index.md)
3. 如果你想理解 YAML 与生成链路，先看 [docs/2-CORE-CONCEPTS/index.md](D:/Code/VSCode_Project/Prose2Play/docs/2-CORE-CONCEPTS/index.md)
4. 如果你想参与开发，直接看 [docs/7-DEVELOPMENT/index.md](D:/Code/VSCode_Project/Prose2Play/docs/7-DEVELOPMENT/index.md)

## 当前仓库状态

当前仓库已完成：

- 产品能力定义
- PRD
- 技术架构方案
- YAML Schema 与 JSON Schema
- monorepo 目录骨架
- 文档导航骨架

后续可直接继续实现：

- `apps/api` HTTP 接口
- `apps/worker` 生成任务执行器
- `apps/web` 前端工作台
- `packages/*` 共享能力

## 顶层导航

- 文档总入口：[docs/index.md](D:/Code/VSCode_Project/Prose2Play/docs/index.md)
- 开发说明：[CONTRIBUTING.md](D:/Code/VSCode_Project/Prose2Play/CONTRIBUTING.md)
- 安全策略：[SECURITY.md](D:/Code/VSCode_Project/Prose2Play/SECURITY.md)
- 变更记录：[CHANGELOG.md](D:/Code/VSCode_Project/Prose2Play/CHANGELOG.md)
- AI 协作说明：[AGENTS.md](D:/Code/VSCode_Project/Prose2Play/AGENTS.md)
