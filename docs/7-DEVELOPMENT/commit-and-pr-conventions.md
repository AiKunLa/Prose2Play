# Git 提交与 PR 规范

## 提交规范

本项目使用 Conventional Commits。

### 格式

```text
<type>: <summary>
```

### 常用 type

- `feat`：新增功能
- `fix`：修复问题
- `docs`：文档修改
- `refactor`：重构，不改变用户可见功能
- `test`：测试补充或调整
- `chore`：仓库维护、脚手架、规则、依赖等非业务功能改动
- `build`：构建系统相关
- `ci`：CI/CD 配置相关

### 编写要求

- `summary` 使用简洁英文短语
- 聚焦“这次改动产生了什么结果”
- 不写模糊信息，如 `update files`、`fix bug`

### 推荐示例

- `docs: add branching and pull request rules`
- `chore: add repository lint and schema checks`
- `feat: add adaptation job creation endpoint`
- `fix: preserve scene source refs during regeneration`

## PR 规范

### 1. 基于 PR 添加新功能

新功能必须基于 PR 合并。

### 2. 每个 PR 只做一件事

每个 PR 只实现或修改单一功能，鼓励尽可能小、粒度尽可能细的 PR；大功能应拆分为多个独立 PR 分步提交。

### 3. PR 标题与描述需清晰完整

PR 内容至少包含：

#### 标题

一句话说明本 PR 新增或修改了什么。

#### 功能描述

说明该功能或改动的作用与使用方式。

#### 实现思路

简要说明技术选型或核心实现逻辑。

#### 测试方式

说明如何验证该功能正常运行。

### 4. 合并后主分支必须可运行

PR 合并后，主分支代码应保持可运行状态，评委、协作者或维护者在任意时间查看都应能复现演示效果或至少完成规定检查。

## PR 大小建议

### 理想 PR

- 只改一个主题
- 文件范围集中
- 审阅者可以在较短时间内看懂

### 需要拆分的 PR

- 同时改文档、规则、API、Worker、Web、Schema
- 既有大规模重构，又有新功能上线
- 一次性跨越多个系统边界

## 当前项目的提交建议

### 当前仓库最合适的提交方式

结合仓库现状，当前改动更接近“初始化阶段基础建设”，建议至少拆成以下 3 组提交：

1. `docs: add layered project documentation structure`
2. `chore: bootstrap prose2play monorepo workspace`
3. `chore: add repository rules and executable checks`

如果你希望更细，还可以拆成：

1. `docs: add project and product documentation foundation`
2. `docs: add development and contribution guides`
3. `chore: bootstrap monorepo apps and packages structure`
4. `chore: add workspace lint, typecheck, test, and schema checks`

### 当前最适合的分支名

如果现在准备提交这一批初始化工作，推荐使用：

- `chore/repository-bootstrap`

如果准备拆成多次 PR，则推荐：

- `docs/documentation-foundation`
- `chore/monorepo-bootstrap`
- `chore/repository-rules`
