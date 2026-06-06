# 无法连接数据库

## 常见根因

- `DATABASE_URL` 错误或缺失
- PostgreSQL 容器未启动
- 本地端口被占用
- 用户名、密码或数据库名不匹配
- 迁移目录存在，但数据库尚未初始化

## 建议排查顺序

1. 检查 `.env` 中的 `DATABASE_URL`
2. 运行 `pnpm db:up`
3. 运行 `pnpm db:health`
4. 如果数据库为空，运行 `pnpm db:migrate`

## 默认本地连接参数

- host：`127.0.0.1`
- port：`5432`
- database：`prose2play`
- user：`postgres`
- password：`postgres`

## 常见报错

### 缺少 `DATABASE_URL`

`loadDatabaseConfig` 会在启动时直接报错。请先创建 `.env` 并补齐数据库配置。

### `PostgreSQL provider health check failed`

这通常表示配置已被读取，但应用仍无法连接真实数据库。优先检查：

- Docker 是否已启动
- PostgreSQL 容器是否健康
- 端口 `5432` 是否冲突
- 连接字符串是否与 Compose 默认值一致

### 迁移失败

请确认：

- 已执行 `pnpm db:generate`
- `packages/providers/drizzle/` 目录存在 SQL 迁移文件
- 当前数据库用户有建表权限
