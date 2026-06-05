# AGENTS

本目录是生成链路核心区。

## 修改这里时要同步检查

- `packages/domain`
- `packages/schema`
- `docs/2-CORE-CONCEPTS/novel-to-screenplay-workflow.md`
- `docs/2-CORE-CONCEPTS/jobs-and-state-machine.md`

## 局部约束

- 先分析、再规划、再生成，不要把所有逻辑揉成一步
- 结构修复只能修结构，不要静默篡改剧情语义
- 局部重生成必须保留稳定 ID 和来源映射
