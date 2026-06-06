# 本地开发安装

## 步骤

1. 安装 Node.js 和 `pnpm`
2. 在仓库根目录创建 `.env`
3. 启动本地 PostgreSQL
4. 执行数据库迁移
5. 验证数据库健康状态

## 当前可用命令

```bash
cp .env.example .env
pnpm db:up
pnpm db:migrate
pnpm db:health
```

当前分支已经支持：

- PostgreSQL 本地启动
- 数据库配置解析
- Drizzle 迁移执行
- 核心表创建

当前分支还未接入完整的 API / Worker 持久化业务流程。
