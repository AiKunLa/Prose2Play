# AGENTS

本文件是 `Prose2Play` 的仓库级全局规则，适用于 Codex、Claude Code 与其他 AI 开发代理，也适用于人工开发者。

## 1. 项目定位

- 项目名称：`Prose2Play`
- 形态：`pnpm monorepo`
- 产品类型：AI 辅助小说转剧本平台
- 核心输出：结构化 YAML 剧本初稿

## 2. 先读哪里

开始改动前，先按顺序读取：

1. `README.md`
2. `docs/index.md`
3. `docs/7-DEVELOPMENT/repository-structure.md`
4. 与当前目录对应的局部 `AGENTS.md` 或 `README.md`

## 3. monorepo 全局边界

### 目录职责

- `apps/*`：运行时应用
- `packages/*`：共享能力包
- `docs/*`：面向用户、运维和开发者的文档
- `infra/*`：部署与基础设施
- `scripts/*`：仓库自动化脚本
- `tests/*`：跨包测试与 fixture

### 不允许的依赖方式

- `apps/*` 之间不允许直接互相依赖
- 业务规则不允许散落在 `apps/*` 页面、路由或控制器中
- 外部模型、存储、队列 SDK 不允许直接在业务层使用，必须走 `packages/providers`
- Schema 相关事实源不允许散落在多个目录，统一以 `packages/schema` 为准

### 推荐依赖方向

- `apps/*` -> `packages/*`
- `packages/pipeline` -> `packages/domain` / `packages/providers` / `packages/schema` / `packages/shared`
- `packages/providers` -> 第三方 SDK

## 4. 通用工程规则

### 命名与结构

- 命名必须清晰、稳定、可检索
- 避免 `temp`、`misc`、`helper2` 这类模糊名称
- 新模块必须有明确职责，不要把多个职责塞进一个目录

### 类型与输入校验

- 禁止默认使用 `any`
- 所有外部输入都必须校验
- API 请求、环境变量、队列消息、Provider 响应都必须经过显式校验

### 不可变性

- 默认使用不可变更新
- 不要在共享对象上做静默原地修改

### 错误处理

- 禁止吞错
- 必须区分用户可见错误和内部诊断错误
- 不要把敏感细节直接返回给前端

### 测试

- 新增核心逻辑必须补测试
- Bug 修复必须尽量先补复现测试
- 状态机、Schema 校验、关键领域规则必须有测试覆盖

## 5. AI 项目特有规则

### 生成链路必须分阶段

默认流程必须保持为：

1. `ingestion`
2. `analysis`
3. `planning`
4. `drafting`
5. `validation`
6. `repair`（仅在需要时）

禁止把“小说全文 -> 最终持久化 YAML”做成一步式黑盒调用。

### 模型输出不可信

- 模型输出必须先校验，后持久化
- 不允许直接把模型输出写入数据库或返回为最终结构
- 结构修复只允许修结构，不允许静默篡改剧情语义

### 追溯性要求

- 每个 scene 必须有 `source_refs`
- AI 新增桥接内容必须显式标注
- 不确定信息必须进入 `open_questions` 或类似字段

### 用户编辑优先

- 人工修改优先级高于 AI 自动结果
- 局部重生成不能破坏其他场景
- 局部重生成不能重建稳定 ID

## 6. Schema 规则

- `packages/schema` 是唯一 Schema 事实源
- 剧本结构变更时，必须同步更新：
  - `packages/schema/schemas/`
  - `packages/schema/examples/`
  - `docs/2-CORE-CONCEPTS/screenplay-yaml-model.md`
  - `docs/8-REFERENCE/json-schema-reference.md`
- Schema 变更必须评估兼容性影响

## 7. 文档同步规则

### 用户可见能力变化时

必须更新：

- `docs/3-USER-GUIDE/*`
- 必要时更新 `README.md`

### 架构或流程变化时

必须更新：

- `docs/2-CORE-CONCEPTS/*`
- `docs/7-DEVELOPMENT/*`

### 新配置项时

必须更新：

- `docs/5-CONFIGURATION/*`

## 8. 局部规则入口

修改前请继续查看相关局部规则：

- `packages/config/AGENTS.md`
- `packages/domain/AGENTS.md`
- `packages/pipeline/AGENTS.md`
- `packages/providers/AGENTS.md`
- `packages/schema/AGENTS.md`
- `packages/shared/AGENTS.md`

## 9. 可执行约束

仓库级检查命令：

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm schema:check`
- `pnpm docs:check`
- `pnpm check`

在增加新模块、Schema、配置或流程后，默认应至少运行与改动相关的检查。

## 10. Git 与分支规则

### 分支策略

- 禁止直接在主分支上开发功能
- 所有非文档级极小修复都应通过分支开发并以 PR 合并
- 主分支必须始终保持可检查、可演示、可继续开发

### 推荐分支命名

- `feat/<short-topic>`
- `fix/<short-topic>`
- `docs/<short-topic>`
- `refactor/<short-topic>`
- `chore/<short-topic>`
- `test/<short-topic>`

示例：

- `feat/adaptation-job-api`
- `docs/repo-contribution-rules`
- `chore/monorepo-bootstrap`

### 提交规范

- 使用 Conventional Commits
- 格式：`<type>(<scope>): <summary>`
- summary 使用简洁英文短语，聚焦本次改动结果
- `scope` 应指向改动边界，例如 `docs`、`monorepo`、`tooling`、`schema`、`api`

允许的常用 type：

- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `chore`
- `build`
- `ci`

示例：

- `docs(contributing): add branching and pull request rules`
- `chore(monorepo): bootstrap prose2play workspace`
- `test(repository): add repository rule checks`

### PR 规则

- 新功能必须基于 PR 合并
- 每个 PR 只做一件事
- 大功能必须拆分为多个小 PR
- PR 标题与描述必须完整
- PR 合并后主分支必须保持可运行、可检查

PR 描述至少包含：

- 标题：一句话说明本 PR 改了什么
- 功能描述：这次改动解决什么问题
- 实现思路：核心技术方案或约束
- 测试方式：如何验证

### 例外情况

如果仓库尚未发布且仍处于首次初始化阶段，允许一次性提交“基础骨架 PR”，但该 PR 仍需明确范围，只包含初始化工作，不混入具体业务功能开发。
