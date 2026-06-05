# AGENTS

本目录是剧本结构的唯一事实源。

## 规则

- JSON Schema 与 YAML 示例必须保持同步
- 示例文件必须尽量覆盖核心字段和典型场景
- 任何结构变更都要评估兼容性和迁移成本
- Schema 检查应尽量早于业务执行

## 同步更新

- `docs/2-CORE-CONCEPTS/screenplay-yaml-model.md`
- `docs/8-REFERENCE/json-schema-reference.md`
- `packages/schema/examples/*`
