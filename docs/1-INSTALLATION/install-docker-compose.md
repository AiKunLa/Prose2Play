# Docker Compose 安装

当前仓库已经提供本地 PostgreSQL 16 的 Compose 配置：

- 文件：`infra/docker/postgres.compose.yaml`
- 默认数据库名：`prose2play`
- 默认用户名：`postgres`
- 默认密码：`postgres`

## 启动与停止

```bash
pnpm db:up
pnpm db:down
```

## 初始化数据库

在 PostgreSQL 启动后，执行：

```bash
pnpm db:migrate
pnpm db:health
```

验证通过后，说明本地数据库、迁移脚本和 provider 健康检查都已正常工作。
