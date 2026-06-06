import type { JobMetric, PipelineStage, RoleCard, SliderMetric, UploadChapter } from "../types";

export const newJobContent = {
  badge: "Create New Job",
  title: "发起新改编任务",
  description:
    "通过原文、调性与约束条件，定义本次改编的生成边界。Stitch 设计稿中的双栏编排结构已在这里完成还原。"
};

export const audienceOptions = ["电影感悬疑", "平台短剧", "青年向群像"];

export const uploadChapters: UploadChapter[] = [
  { name: "chapter-01.md", size: "18 KB", status: "已导入" },
  { name: "chapter-02.md", size: "24 KB", status: "待解析" },
  { name: "chapter-03.md", size: "21 KB", status: "已校验" }
];

export const aiSettingSliders: SliderMetric[] = [
  {
    title: "情绪张力",
    description: "更靠近克制与压抑。",
    value: 78
  },
  {
    title: "镜头感",
    description: "突出环境、停顿与动作切分。",
    value: 64
  },
  {
    title: "原文忠实度",
    description: "优先保留情节事实，再润色节奏。",
    value: 86
  }
];

export const newJobNote =
  "导入三章原文后，先运行 analysis + planning，确认人物弧线后再进入 drafting。";

export const detailContent = {
  badge: "In Progress",
  title: "改编项目详情",
  description:
    "项目正处于起草阶段，结构和语气已趋于稳定，接下来重点是检查节奏、角色动机与 YAML 输出的一致性。"
};

export const pipelineStages: PipelineStage[] = [
  { label: "导入", done: true },
  { label: "分析", done: true },
  { label: "规划", done: true },
  { label: "起草", done: true, active: true },
  { label: "校验", done: false },
  { label: "修复", done: false }
];

export const detailMetrics: JobMetric[] = [
  {
    label: "草稿完整度",
    value: "80%",
    description: "Scene 01-08 已生成，09-10 等待校验。"
  },
  {
    label: "质量风险",
    value: "03",
    description: "主要集中在人物语气一致性与节奏压缩。"
  },
  {
    label: "开放问题",
    value: "07",
    description: "涉及桥接剧情是否需要额外来源标注。"
  }
];

export const roleCards: RoleCard[] = [
  {
    title: "主角弧线",
    text: "冷感理性逐渐被责任与信任撬开，情绪释放节点落在 rooftop confrontation。"
  },
  {
    title: "反派动机",
    text: "将“控制城市叙事”的野心从结果层，前置到对记忆垄断的执念。"
  },
  {
    title: "节奏风险",
    text: "Scene 07 到 Scene 09 的信息密度过高，建议拆分为动作 beats 与心理 beats。"
  }
];

export const yamlPreview = `scene_id: scene-01
heading: "EXT. CITY STREET - NIGHT"
purpose: "Introduce the protagonist under pressure"
source_refs:
  - chapter: 1
    paragraphs: [14, 15, 16]
beats:
  - id: beat-01
    type: atmosphere
    summary: "Rain, neon, closed cinema facade"
  - id: beat-02
    type: action
    summary: "Black sedan arrives, forcing decision"`;
