# apps/api

`apps/api` 是对外 HTTP API 应用。

## 职责

- 暴露 adaptation job 和 draft 接口
- 处理鉴权、请求校验与响应编排
- 调用 `packages/*` 中的领域与流程能力

## 不应该做什么

- 不直接实现核心生成逻辑
- 不直接耦合具体 Provider 细节

## 下一步

- 在 `src/` 下实现路由、控制器和应用装配
