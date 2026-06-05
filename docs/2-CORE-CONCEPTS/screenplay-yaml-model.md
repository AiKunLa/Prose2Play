# 剧本 YAML Schema 定义

## 1. 设计目标

这个 Schema 不是为了追求“最完整的编剧格式标准”，而是为了服务 AI 改编场景下的三个目标：

1. 让模型稳定产出结构化初稿。
2. 让作者能直接阅读和手改。
3. 让后续程序可以继续加工、校验、导出。

因此，它采用“元数据 + 角色资产 + 场景列表 + 场景内容块”的四层结构，而不是一次性把剧本压成纯文本。

## 2. 设计原因

### 2.1 为什么选择 YAML

- YAML 对作者更友好，可读性明显高于纯 JSON。
- YAML 适合保留层级关系，便于表示剧本中的“作品 -> 场景 -> 内容块”结构。
- YAML 允许模型先生成结构，再逐段填充内容，降低输出失控概率。
- YAML 易于转换到 JSON Schema、数据库对象和前端表单。

### 2.2 为什么要保留 `source_refs`

- 小说改编最核心的能力不是“会写”，而是“能追溯”。
- 作者和编辑需要知道某场戏来自哪些章节，方便核对删改。
- 后续如果支持局部重生成，`source_refs` 可以作为最小重算依据。

### 2.3 为什么场景正文用 `content` 块，而不是整段字符串

- 编剧修改时，经常只想改某句对白、某段动作或某个转场。
- 程序导出到 Markdown、Fountain、Final Draft 时，也需要知道每一段是什么类型。
- 分块结构更适合做局部重写、审校提示和差异对比。

### 2.4 为什么角色、地点、道具要有稳定 ID

- 小说里角色可能有别名、称呼变化和身份变化。
- 用 ID 作为内部引用，可以避免名称修改后全局断链。
- 稳定 ID 便于后续做角色出场统计、关系图、连续性检查。

### 2.5 为什么要显式记录 `adaptation_notes` 和 `open_questions`

- AI 改编常常需要桥接或压缩情节，这部分不能伪装成“原著原样”。
- 对理解不确定、节奏冲突或角色动机不清的地方，应该显式暴露给作者。
- 这能让输出更可信，也利于后续迭代。

## 3. 顶层结构

```yaml
schema_version: "1.0"
script:
  ...
source:
  ...
adaptation:
  ...
characters:
  - ...
locations:
  - ...
props:
  - ...
scenes:
  - ...
quality_notes:
  ...
```

## 4. 字段定义

### 4.1 `schema_version`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `schema_version` | string | 是 | Schema 版本号，便于未来升级和兼容。 |

### 4.2 `script`

剧本本体元数据。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `script.id` | string | 是 | 剧本唯一 ID。 |
| `script.title` | string | 是 | 剧本标题。 |
| `script.language` | string | 是 | 输出语言，例如 `zh-CN`。 |
| `script.format` | string | 是 | 目标格式，例如 `series_episode`、`short_drama`、`feature_outline_script`。 |
| `script.genre` | string[] | 否 | 类型标签，例如 `["悬疑","言情"]`。 |
| `script.logline` | string | 否 | 一句话故事概述。 |
| `script.target_duration_minutes` | integer | 否 | 目标成片时长。 |
| `script.created_at` | string | 否 | 生成时间，推荐 ISO 8601。 |
| `script.updated_at` | string | 否 | 更新时间，推荐 ISO 8601。 |

### 4.3 `source`

原小说信息。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `source.work_title` | string | 是 | 原作品名。 |
| `source.author` | string | 否 | 原作者。 |
| `source.language` | string | 是 | 原文语言。 |
| `source.chapter_range` | object | 是 | 本次改编覆盖的章节范围。 |
| `source.chapter_range.start` | integer | 是 | 起始章节号。 |
| `source.chapter_range.end` | integer | 是 | 结束章节号。 |
| `source.chapters` | array | 是 | 本次输入的章节清单。 |

`source.chapters[*]` 结构：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `number` | integer | 是 | 章节号。 |
| `title` | string | 否 | 章节标题。 |
| `summary` | string | 否 | 章节摘要。 |
| `word_count` | integer | 否 | 章节字数。 |

### 4.4 `adaptation`

改编策略信息。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `adaptation.mode` | string | 是 | 改编模式，例如 `faithful`、`drama_first`、`dialogue_enhanced`。 |
| `adaptation.compression_ratio` | number | 否 | 压缩比例，例如 `0.35` 表示保留约 35% 情节长度。 |
| `adaptation.strategy_summary` | string | 是 | 本次改编的总策略。 |
| `adaptation.kept_threads` | string[] | 否 | 保留的主线。 |
| `adaptation.merged_events` | string[] | 否 | 合并处理的事件说明。 |
| `adaptation.omitted_elements` | string[] | 否 | 删去的支线、描写或设定。 |
| `adaptation.added_bridges` | string[] | 否 | 为剧本流畅性新增的桥接内容。 |

### 4.5 `characters`

角色表。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `characters[].id` | string | 是 | 角色稳定 ID。 |
| `characters[].name` | string | 是 | 主显示名称。 |
| `characters[].aliases` | string[] | 否 | 别名、称呼。 |
| `characters[].role` | string | 否 | 角色功能，例如 `protagonist`、`antagonist`、`supporting`。 |
| `characters[].description` | string | 否 | 简短人物介绍。 |
| `characters[].motivation` | string | 否 | 当前阶段主要动机。 |
| `characters[].arc_notes` | string | 否 | 角色弧线说明。 |
| `characters[].source_refs` | array | 否 | 首次出现或关键信息来源。 |

### 4.6 `locations`

地点表。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `locations[].id` | string | 是 | 地点稳定 ID。 |
| `locations[].name` | string | 是 | 地点名称。 |
| `locations[].type` | string | 否 | 地点类型，例如 `home`、`street`、`school`。 |
| `locations[].description` | string | 否 | 视觉或叙事描述。 |

### 4.7 `props`

关键道具表，可选。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `props[].id` | string | 是 | 道具稳定 ID。 |
| `props[].name` | string | 是 | 道具名称。 |
| `props[].story_function` | string | 否 | 剧情功能，例如线索、定情物、证据。 |

### 4.8 `scenes`

场景列表，是整个 Schema 的核心。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `scenes[].id` | string | 是 | 场景稳定 ID。 |
| `scenes[].number` | integer | 是 | 场次编号。 |
| `scenes[].act` | integer | 否 | 所属幕次。 |
| `scenes[].title` | string | 是 | 场景标题，便于阅读和检索。 |
| `scenes[].slugline` | object | 是 | 标准场景头信息。 |
| `scenes[].slugline.interiority` | string | 是 | `INT`、`EXT` 或 `INT/EXT`。 |
| `scenes[].slugline.location_id` | string | 是 | 引用 `locations[].id`。 |
| `scenes[].slugline.time_of_day` | string | 是 | 例如 `DAY`、`NIGHT`、`DAWN`、`DUSK`。 |
| `scenes[].summary` | string | 是 | 一到两句场景摘要。 |
| `scenes[].dramatic_purpose` | string | 否 | 该场戏承担的叙事作用。 |
| `scenes[].cast` | string[] | 是 | 出场角色 ID 列表。 |
| `scenes[].props` | string[] | 否 | 出场道具 ID 列表。 |
| `scenes[].source_refs` | array | 是 | 来源章节映射。 |
| `scenes[].adaptation_notes` | string[] | 否 | 该场的局部改编说明。 |
| `scenes[].open_questions` | string[] | 否 | 该场待确认问题。 |
| `scenes[].content` | array | 是 | 场景正文块。 |

`scenes[].source_refs[*]` 结构：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `chapter` | integer | 是 | 来源章节号。 |
| `note` | string | 否 | 来源说明，例如“由旁白改写为对白”。 |
| `importance` | string | 否 | `primary` 或 `secondary`。 |

`scenes[].content[*]` 结构：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `type` | string | 是 | `action`、`dialogue`、`parenthetical`、`transition`、`shot_note` 之一。 |
| `character_id` | string | 条件必填 | 当 `type=dialogue` 或 `type=parenthetical` 时必填。 |
| `text` | string | 是 | 正文文本。 |
| `emotion` | string | 否 | 情绪提示。 |
| `subtext` | string | 否 | 潜台词说明。 |
| `source_ref` | object | 否 | 指向更细粒度来源。 |

### 4.9 `quality_notes`

整体质量说明。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `quality_notes.warnings` | string[] | 否 | 模型认为可能存在的风险。 |
| `quality_notes.rewrite_suggestions` | string[] | 否 | 建议作者重点重写的地方。 |
| `quality_notes.confidence` | number | 否 | 0 到 1 的整体置信度。 |

## 5. 推荐校验规则

1. `source.chapter_range.end - source.chapter_range.start + 1` 必须大于等于 3。
2. `source.chapters` 中的章节号必须连续且不重复。
3. `scenes[].number` 必须严格递增。
4. `scenes[].slugline.location_id` 必须能在 `locations` 中找到。
5. `scenes[].cast` 中的角色 ID 必须能在 `characters` 中找到。
6. 每个场景至少包含一个 `source_refs` 条目。
7. 每个场景至少包含一个 `content` 条目。
8. `dialogue` 类型的内容块必须有 `character_id`。
9. `transition` 类型的内容块不应填写 `character_id`。
10. 如果 `adaptation.added_bridges` 非空，相关场景应在 `adaptation_notes` 中说明桥接原因。

## 6. 推荐最小可用示例

下面的 YAML 不是完整长剧本，只展示推荐结构。

```yaml
schema_version: "1.0"
script:
  id: "script_red_curtain_ep01"
  title: "红帘之后"
  language: "zh-CN"
  format: "short_drama"
  genre: ["悬疑", "情感"]
  logline: "失踪姐姐留下的一把旧钥匙，让林晚重新走进那栋她发誓不再回去的宅子。"
  target_duration_minutes: 18
source:
  work_title: "红帘之后"
  author: "示例作者"
  language: "zh-CN"
  chapter_range:
    start: 1
    end: 3
  chapters:
    - number: 1
      title: "钥匙"
      summary: "林晚收到姐姐遗物中的旧钥匙。"
    - number: 2
      title: "旧宅"
      summary: "林晚回到旧宅，遇见守宅人。"
    - number: 3
      title: "红帘"
      summary: "林晚在红帘后发现姐姐留下的录音。"
adaptation:
  mode: "drama_first"
  compression_ratio: 0.42
  strategy_summary: "保留寻找姐姐线索的主线，压缩心理描写，增加对峙感更强的对白。"
characters:
  - id: "char_linwan"
    name: "林晚"
    role: "protagonist"
    description: "外冷内敏感的年轻作家。"
  - id: "char_keeper"
    name: "周伯"
    role: "supporting"
    description: "守着旧宅多年的老人。"
locations:
  - id: "loc_apartment"
    name: "林晚公寓"
  - id: "loc_old_house"
    name: "旧宅前厅"
props:
  - id: "prop_key"
    name: "旧钥匙"
    story_function: "线索"
scenes:
  - id: "scene_001"
    number: 1
    title: "钥匙出现"
    slugline:
      interiority: "INT"
      location_id: "loc_apartment"
      time_of_day: "NIGHT"
    summary: "林晚在姐姐遗物中发现一把陌生的旧钥匙，决定回旧宅。"
    dramatic_purpose: "建立悬念并给出行动动机。"
    cast: ["char_linwan"]
    props: ["prop_key"]
    source_refs:
      - chapter: 1
        importance: "primary"
    content:
      - type: "action"
        text: "雨声敲着窗。林晚把纸箱里的旧信件一封封取出，直到一把生锈的钥匙滚落在桌面。"
      - type: "action"
        text: "她愣住，认出钥匙柄上那道刻痕，和姐姐常画在手账上的记号一模一样。"
      - type: "dialogue"
        character_id: "char_linwan"
        text: "姐，你到底把什么留在那儿了？"
  - id: "scene_002"
    number: 2
    title: "重返旧宅"
    slugline:
      interiority: "INT"
      location_id: "loc_old_house"
      time_of_day: "NIGHT"
    summary: "林晚回到旧宅，周伯试图阻止她继续往里走。"
    dramatic_purpose: "制造人物对抗，推动进入核心秘密。"
    cast: ["char_linwan", "char_keeper"]
    source_refs:
      - chapter: 2
        importance: "primary"
      - chapter: 3
        importance: "secondary"
        note: "提前引入周伯的阻拦，增强戏剧张力。"
    adaptation_notes:
      - "将原文中的守宅人旁观描写改为正面冲突对白。"
    content:
      - type: "action"
        text: "门轴发出沉重的呻吟。周伯站在前厅尽头，像早就知道她会来。"
      - type: "dialogue"
        character_id: "char_keeper"
        text: "这地方，小姐不该再回来了。"
      - type: "dialogue"
        character_id: "char_linwan"
        text: "如果我姐真在这里留下过东西，那我今天一定要看到。"
quality_notes:
  warnings:
    - "第三章录音内容尚未完整展开，后续场次需要补写。"
  rewrite_suggestions:
    - "可进一步强化林晚与姐姐之间的情感牵引。"
  confidence: 0.82
```

## 7. 版本演进建议

### v1.0

- 支持单份 YAML 剧本初稿输出
- 支持角色、地点、道具、场景和追溯关系
- 支持基本改编说明和质量提示

### v1.1 可扩展方向

- 增加角色关系图字段
- 增加每场预计时长
- 增加节奏标签、情绪曲线和商业钩子标签
- 增加局部重写任务字段，例如“只重写对白”

### v2.0 可扩展方向

- 支持分集结构 `episodes`
- 支持镜头级细化
- 支持多版本草稿和人工修订历史
- 支持导出到 Fountain、Final Draft XML 或前端富文本编辑器
