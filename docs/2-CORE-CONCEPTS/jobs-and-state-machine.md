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

## 为什么需要状态机

- 区分失败发生在哪个阶段
- 支持后台任务重试
- 支持局部重生成挂接到正确阶段
