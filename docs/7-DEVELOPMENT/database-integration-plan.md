# 数据库接入方案

## 1. 能力定义

本方案要为 `Prose2Play` 建立一套可持续演进的持久化能力，使 `apps/api`、`apps/worker` 与后续 `apps/web` 都能围绕同一份任务状态、分析结果、改编计划、结构化剧本草稿和修订历史协作，而不破坏现有“分阶段生成 + Schema 校验 + 可追溯 + 用户编辑优先”的产品原则。

## 2. 固定约束

- `packages/schema` 仍然是剧本结构的唯一事实源，数据库不能替代 YAML / JSON Schema 的定义权。
- 生成链路必须保持 `ingestion -> analysis -> planning -> drafting -> validation -> repair(按需)` 的分阶段模型，禁止把模型输出直接持久化为最终可用剧本。
- `packages/domain` 只承载领域实体、状态机和不变量，不放 SQL、ORM、连接池或第三方数据库 SDK 细节。
- 所有数据库、对象存储、队列能力都必须通过 `packages/providers` 暴露；`apps/*` 和 `packages/pipeline` 只依赖抽象接口。
- 用户手工编辑优先于 AI 自动结果；局部重生成必须保留稳定 ID、`source_refs` 和已有人工修订边界。
- 外部输入必须先校验后持久化；模型输出必须先通过结构校验再落库。
- 每条业务数据都必须绑定 `user_id`，为后续多租户或团队空间演进预留 `tenant_id`。
- 失败必须可追踪到具体阶段、具体尝试和具体错误，不允许“只知道失败，不知道失败在何处”。

## 3. 推荐技术选型

| 层 | 推荐方案 | 原因 |
| --- | --- | --- |
| 主数据库 | PostgreSQL 16 | 适合事务、一致性、JSONB、乐观并发控制和后台任务 claim |
| 查询与迁移 | Drizzle ORM + drizzle-kit | TypeScript 友好，迁移明确；复杂查询可直接回退原生 SQL |
| 大对象存储 | S3 兼容对象存储（开发环境可用 MinIO） | 适合原文快照、YAML 导出、审计附件等大文本或文件对象 |
| 队列（MVP） | 先以 PostgreSQL claim 模式为主 | 降低基础设施复杂度，先把状态机和幂等性做稳 |
| 队列（二期） | BullMQ / SQS / Cloud Tasks，通过 provider 接入 | 当并发量或隔离要求上升时再切换 |

### 选型原则

- PostgreSQL 是系统记录源，负责“可查询、可事务化、可回放”的业务事实。
- 对象存储负责“体积大、版本化、低频查询”的原文和 YAML 文件。
- JSONB 用于保留分析结果、改编计划和剧本结构的完整快照，但不把所有读取都压成 JSONB 扫描。
- 对需要筛选和局部重生成的字段，增加投影表而不是频繁解析整份剧本 JSON。

## 4. 分层落位

```text
apps/api
apps/worker
  -> packages/pipeline
    -> ports/persistence/*
    -> ports/storage/*
    -> ports/queue/*
      -> packages/providers
        -> database/postgres/*
        -> storage/s3/*
        -> queue/postgres-claim/*
```

### 推荐目录

```text
packages/pipeline/src/ports/
  persistence/
    work-repository.ts
    adaptation-job-repository.ts
    source-chapter-repository.ts
    analysis-snapshot-repository.ts
    draft-repository.ts
    draft-revision-repository.ts
    unit-of-work.ts
  storage/
    source-asset-store.ts
    draft-artifact-store.ts
  queue/
    job-dispatcher.ts

packages/providers/src/database/postgres/
  client.ts
  schema/
  mappers/
  repositories/
  migrations/

packages/providers/src/storage/
  object-store.ts
```

### 为什么把仓储接口放在 `packages/pipeline`

- 这些接口服务于“任务编排和用例执行”，而不是领域对象本身。
- 一个用例通常会跨 `AdaptationJob`、分析快照、草稿、修订历史和 outbox 事件，不属于单一聚合根。
- `packages/domain` 可以继续保持纯粹，只表达状态机、不变量和实体创建/流转规则。

## 5. 存储职责划分

### PostgreSQL 中保存

- `Work` 元数据
- `AdaptationJob` 状态机与失败信息
- 章节标准化元数据与对象存储引用
- 分析结果、改编计划、剧本 JSON 快照
- 当前激活草稿与修订链
- 场景筛选投影
- 阶段执行记录、重试记录、幂等键和 outbox 事件

### 对象存储中保存

- 原始章节全文快照
- 规范化章节全文快照
- 生成后的 YAML 文件
- 可选的导出文件与审计附件

### 不建议直接放入数据库的大对象

- 超长原文全文
- 未脱敏的 provider prompt / response 原文
- 前端临时编辑草稿缓存

## 6. 逻辑数据模型

### 6.1 `works`

保存作品级元数据，不和单次改编任务混在一起。

关键字段：

- `id`
- `user_id`
- `title`
- `author_name`
- `source_language`
- `created_at`
- `updated_at`
- `deleted_at`

索引建议：

- `(user_id, updated_at desc)`

### 6.2 `adaptation_jobs`

保存任务状态机，是 API 与 Worker 协作的主表。

关键字段：

- `id`
- `user_id`
- `work_id`
- `status`
- `target_format`
- `adaptation_mode`
- `target_duration_minutes`
- `chapter_range_start`
- `chapter_range_end`
- `request_fingerprint`
- `current_draft_id`
- `last_error_code`
- `last_error_message`
- `failed_from_stage`
- `created_at`
- `updated_at`

约束与索引：

- `status` 必须只允许领域状态机中的枚举值
- `(work_id, chapter_range_start, chapter_range_end, adaptation_mode, target_format)` 普通组合索引
- `request_fingerprint` 唯一索引，用于 API 幂等提交
- `(user_id, status, updated_at desc)` 列表查询索引

### 6.3 `source_chapters`

保存章节元数据和对象存储引用，不直接承担全部原文体积。

关键字段：

- `id`
- `job_id`
- `chapter_number`
- `chapter_title`
- `word_count`
- `raw_text_object_key`
- `normalized_text_object_key`
- `content_hash`
- `created_at`

约束与索引：

- `(job_id, chapter_number)` 唯一索引
- `(content_hash)` 普通索引，便于后续去重分析

### 6.4 `job_stage_runs`

显式记录每个阶段的每次执行，支撑重试、观测和失败定位。

关键字段：

- `id`
- `job_id`
- `stage`
- `attempt`
- `status`
- `provider_name`
- `provider_model`
- `started_at`
- `finished_at`
- `duration_ms`
- `error_code`
- `error_message`
- `metrics_json`

说明：

- `metrics_json` 可存 token、响应长度、修复次数、告警标记等。
- 当任务从 `failed` 重试到原阶段时，`attempt` 自增，不覆盖历史。

### 6.5 `analysis_snapshots`

保存叙事分析结果快照。

关键字段：

- `id`
- `job_id`
- `stage_run_id`
- `analysis_json`
- `schema_version`
- `created_at`

说明：

- 使用追加式快照，而不是原地覆盖，便于回溯失败与模型漂移。

### 6.6 `adaptation_plan_snapshots`

保存改编计划快照。

关键字段：

- `id`
- `job_id`
- `stage_run_id`
- `plan_json`
- `created_at`

### 6.7 `screenplay_drafts`

保存剧本主快照。推荐把“结构化 JSON”作为程序主事实，把 YAML 作为派生工件。

关键字段：

- `id`
- `job_id`
- `base_draft_id`
- `revision_number`
- `is_active`
- `schema_version`
- `draft_json`
- `draft_yaml_object_key`
- `validation_status`
- `validation_errors_json`
- `editor_type`
- `lock_version`
- `created_at`
- `updated_at`

关键规则：

- 模型输出先写入 `draft_json`，结构校验通过后再生成 YAML 并写 `draft_yaml_object_key`
- 每个 job 只允许一个 `is_active = true` 的草稿
- `lock_version` 用于前端保存时的乐观并发控制

### 6.8 `draft_scene_index`

这是重要的读模型，用于场景列表、筛选和局部重生成入口，不建议每次都去扫描整份 `draft_json`。

关键字段：

- `id`
- `draft_id`
- `scene_id`
- `scene_number`
- `title`
- `location_id`
- `cast_ids`
- `source_chapters`
- `has_open_questions`
- `updated_at`

索引建议：

- `(draft_id, scene_number)` 唯一索引
- `GIN(cast_ids)`
- `GIN(source_chapters)`

### 6.9 `draft_revisions`

记录人工编辑和局部重生成的变更历史。

关键字段：

- `id`
- `draft_id`
- `revision_number`
- `change_type`
- `editor_type`
- `scope_type`
- `scope_id`
- `base_revision_number`
- `change_payload_json`
- `created_at`

说明：

- `editor_type`: `human | ai | system`
- `scope_type`: `scene | content_block | draft`
- `scope_id` 对应稳定 scene id 或 content block id

### 6.10 `outbox_events`

用于数据库事务和异步执行的解耦。

关键字段：

- `id`
- `aggregate_type`
- `aggregate_id`
- `event_type`
- `payload_json`
- `status`
- `available_at`
- `published_at`
- `created_at`

用途：

- API 创建 job 后写入 `job.ingested`
- 每个阶段完成后写入下一阶段的调度事件
- 用户保存修订后写入重新校验或导出更新事件

## 7. 事务边界

### 7.1 创建任务

建议流程：

1. API 校验输入与 chapter range
2. 把章节全文上传到对象存储
3. 开启数据库事务
4. 插入 `works`（如需要）
5. 插入 `adaptation_jobs`
6. 插入 `source_chapters`
7. 插入 `job_stage_runs` 首条记录
8. 插入 `outbox_events`
9. 提交事务

原因：

- 数据库和对象存储不是同一个事务域，先上传对象，再提交数据库引用，比“先写库后补传文件”更容易保证 job 一旦出现就可被消费。
- 如果数据库事务失败，未引用的对象可由异步清理任务回收。

### 7.2 阶段推进

每个阶段完成时应在同一事务中完成：

- 更新 `adaptation_jobs.status`
- 写入对应快照表
- 写入或更新 `job_stage_runs`
- 刷新 `last_error_*` 或清空失败信息
- 插入下一阶段 `outbox_events`

### 7.3 保存人工编辑

一次编辑保存应在单事务中完成：

- 校验输入 patch 或替换后的结构
- 生成新的 `screenplay_drafts` 版本或更新活动草稿
- 插入 `draft_revisions`
- 重建对应的 `draft_scene_index`
- 更新 `adaptation_jobs.current_draft_id`

### 7.4 失败与重试

任务进入 `failed` 时必须同时写：

- `adaptation_jobs.last_error_code`
- `adaptation_jobs.last_error_message`
- `adaptation_jobs.failed_from_stage`
- 当前 `job_stage_runs` 的失败记录

重试时：

- 只能回到 `failed_from_stage`
- 新开一条 `job_stage_runs` 记录，不覆盖旧 attempt

## 8. 并发与幂等策略

### API 幂等

- `POST /adaptation-jobs` 要求客户端传 `idempotency_key`，服务端生成 `request_fingerprint`
- 如果同一用户在短时间内重复提交相同输入，直接返回现有 job

### Worker 竞争控制

- MVP 可直接从 PostgreSQL 里通过 `FOR UPDATE SKIP LOCKED` claim 可执行任务
- 如果切到外部队列，仍以 `adaptation_jobs` 和 `job_stage_runs` 作为最终状态记录源

### 编辑冲突控制

- `PATCH /drafts/:id` 必须带 `expected_lock_version`
- 不匹配则返回冲突，让前端拉取最新草稿后再合并

## 9. 数据访问约定

### Repository 粒度

建议最少包含以下接口：

- `WorkRepository`
- `AdaptationJobRepository`
- `SourceChapterRepository`
- `AnalysisSnapshotRepository`
- `AdaptationPlanSnapshotRepository`
- `DraftRepository`
- `DraftSceneIndexRepository`
- `DraftRevisionRepository`
- `OutboxEventRepository`
- `UnitOfWork`

### Repository 规则

- 返回领域对象或明确的持久化 DTO，不要泄漏 ORM 模型实例
- 批量读写优先，避免 N+1
- repository 内可做 mapper，但不组装领域流程
- 所有列表接口默认按 `user_id` 过滤

## 10. 安全与合规

- 原文和 YAML 工件必须使用私有对象存储 bucket
- 数据库连接必须最小权限，区分读写账号与迁移账号
- 默认通过服务层做租户隔离；若未来引入直连数据库能力，再评估 RLS
- 不在数据库中保存未脱敏的 provider 机密信息
- 删除作品时采用“业务软删 + 异步物理清理”模式，避免长事务删除大对象

## 11. 可观测性

必须至少能回答以下问题：

- 某个 job 现在卡在哪个阶段
- 当前阶段已经重试了几次
- 失败是输入问题、provider 问题还是结构校验问题
- 某次局部重生成改动了哪个 scene
- 某个模型版本是否让结构失败率上升

建议观测字段：

- `request_id`
- `job_id`
- `stage`
- `attempt`
- `provider_name`
- `provider_model`
- `duration_ms`
- `token_usage`
- `validation_error_count`

## 12. 实施顺序

### Phase 1: 打底

- 在 `packages/config` 增加数据库与对象存储配置解析
- 在 `packages/providers` 建立 PostgreSQL client、迁移脚手架和对象存储 provider
- 在 `packages/pipeline` 定义 persistence ports

### Phase 2: 首次生成闭环

- 落 `works`、`adaptation_jobs`、`source_chapters`、`job_stage_runs`、`outbox_events`
- 实现创建任务、查询任务、worker claim 和状态推进

### Phase 3: 内容快照

- 落 `analysis_snapshots`、`adaptation_plan_snapshots`、`screenplay_drafts`
- 打通“先校验 JSON，再派生 YAML”的持久化流程

### Phase 4: 编辑与局部重生成

- 落 `draft_scene_index`、`draft_revisions`
- 加入乐观锁、scene 级筛选和局部重生成入口

### Phase 5: 硬化

- 清理任务与保留策略
- 失败重试回放
- 指标、告警、审计日志

## 13. 非目标

- 现在不把数据库设计成通用 CMS
- 现在不拆分成多数据库或多写模型
- 现在不把完整 scene / character 关系全面范式化到大量子表
- 现在不引入浏览器直连数据库
- 现在不把向量检索、全文搜索或 BI 报表一起做进 MVP

## 14. 开放问题

- 用户与团队空间的认证模型最终是单用户、团队协作还是多租户 SaaS
- MVP 是否接受“PostgreSQL 兼作队列 claim 源”，还是一开始就接外部队列
- 原文全文是否必须长期保留，还是支持用户在生成后立即清除原文工件
- `draft_scene_index` 是否需要在 MVP 就支持按角色、章节和 open questions 多条件筛选
- 未来是否要为 scene / character 建独立读模型以支撑更复杂编辑器

## 15. 直接实施建议

如果下一步要开始写代码，建议按下面的最短路径推进：

1. 先定义 `packages/pipeline/src/ports/persistence/*` 接口，不先绑死具体 ORM。
2. 先做 PostgreSQL + 对象存储两类 provider，不同时引入外部队列。
3. 先把 `AdaptationJob` 状态机、章节元数据和草稿快照闭环打通，再做 scene 级投影和局部重生成。
4. 所有模型输出统一走“校验成功后入库”的路径，不允许旁路写入。
