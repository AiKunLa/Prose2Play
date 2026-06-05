# Job 与状态机

## 关键状态

- `ingested`
- `analyzed`
- `planned`
- `drafted`
- `validated`
- `edited`
- `exported`
- `failed`

## 章节范围约束

- 一个 adaptation job 必须覆盖连续章节范围
- 章节编号必须是正整数
- `endChapter` 不能小于 `startChapter`
- 默认最小改编范围是 `3` 章

示例：

- 合法：`1..3`
- 合法：`5..8`
- 非法：`2..3`（不足 3 章）
- 非法：`8..6`（结束章节早于开始章节）

## 合法流转

- `ingested -> analyzed`
- `analyzed -> planned`
- `planned -> drafted`
- `drafted -> validated`
- `validated -> edited`
- `validated -> exported`
- `edited -> validated`
- `edited -> exported`

## 失败与重试

- 除 `exported` 外，所有活动状态都可以流转到 `failed`
- `failed` 必须保留失败来源阶段与失败原因
- 从 `failed` 重试时，只能回到原失败阶段，不能跳跃到其他阶段

## 为什么需要状态机

- 区分失败发生在哪个阶段
- 支持后台任务重试
- 支持局部重生成挂接到正确阶段
- 保护领域不变量，不把状态判断散落到 API 或 Worker
