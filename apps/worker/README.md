# apps/worker

`apps/worker` 负责后台任务执行。

## 职责

- 消费 adaptation job
- 执行分析、规划、生成、校验
- 记录状态与错误

## 关键依赖

- `packages/pipeline`
- `packages/providers`
- `packages/schema`
