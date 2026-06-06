# 环境变量参考

建议按职责分组管理：

- Web
- API
- Worker
- Database
- Object Storage
- Queue
- LLM Providers

## Database

### 必填

- `DATABASE_URL`
  - PostgreSQL 连接字符串
  - 示例：`postgres://postgres:postgres@127.0.0.1:5432/prose2play`

### 可选

- `DATABASE_POOL_MIN`
  - 连接池最小连接数
  - 默认：`0`

- `DATABASE_POOL_MAX`
  - 连接池最大连接数
  - 默认：`10`

- `DATABASE_CONNECT_TIMEOUT_MS`
  - 单次连接超时，单位毫秒
  - 默认：`5000`

- `DATABASE_IDLE_TIMEOUT_MS`
  - 空闲连接回收超时，单位毫秒
  - 默认：`10000`

- `DATABASE_STATEMENT_TIMEOUT_MS`
  - SQL 语句超时，单位毫秒
  - 默认：`30000`

- `DATABASE_SSL_MODE`
  - PostgreSQL SSL 模式
  - 可选值：`disable`、`prefer`、`require`
  - 默认：`disable`
