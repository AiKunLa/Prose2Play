# 仓库结构

## monorepo 顶层约定

- `apps/`：运行时应用
- `packages/`：共享能力包
- `docs/`：用户和开发文档
- `infra/`：部署与基础设施
- `scripts/`：仓库自动化脚本
- `tests/`：跨包测试与 fixture

## 推荐职责划分

### apps

- `web`：前端工作台
- `api`：HTTP API 与 BFF
- `worker`：后台任务执行器

### packages

- `domain`：领域模型和不变量
- `pipeline`：生成链路
- `providers`：外部服务适配
- `schema`：YAML/JSON Schema 与示例
- `config`：配置解析
- `shared`：共享工具与类型
