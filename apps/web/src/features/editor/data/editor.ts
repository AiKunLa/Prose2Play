import type { AnalysisNote, Scene } from "../types";

export const scenes: Scene[] = [
  {
    id: "scene-01",
    slug: "SCENE 01",
    title: "EXT. CITY STREET - NIGHT",
    summary: "雨夜街景奠定氛围，并引入主人公的迟疑。",
    status: "locked"
  },
  {
    id: "scene-02",
    slug: "SCENE 02",
    title: "INT. APARTMENT - CONTINUOUS",
    summary: "角色进入私密空间，外部冲突转为内在张力。",
    status: "draft"
  },
  {
    id: "scene-03",
    slug: "SCENE 03",
    title: "INT. COFFEE SHOP - DAY",
    summary: "重要信息在轻松对话中被抛出。",
    status: "draft"
  },
  {
    id: "scene-04",
    slug: "SCENE 04",
    title: "EXT. ROOFTOP - NIGHT",
    summary: "阶段性对抗升级，为转折点蓄力。",
    status: "draft"
  }
];

export const sceneBlocks = [
  "Rain slicked pavement reflects the neon hum of a dying district. Xander stands under the skeletal awning of a closed cinema, smoke curling from his lips in slow, deliberate spirals.",
  "XANDER\n(to himself)\nThey always said the weather would turn before the deal did.",
  "A black sedan rolls silently to the curb. The headlights cut through the mist, two blinding white eyes in the dark. Xander drops the cigarette."
];

export const sourceEvidence = [
  "原文在第 12 节明确描写主角在雨中停留，表现其对即将行动的迟疑。",
  "街面霓虹、雨幕与闭店影院构成视觉母题，适合延展为都市冷感镜头语言。",
  "香烟与车灯的并置，在原著里承担“决定前最后一秒”的心理提示。"
];

export const rewritePresets = ["More Dynamic", "Subtle Tension", "Faster Pacing", "Noir Dialog"];

export const analysisNotes: AnalysisNote[] = [
  {
    title: "Atmospheric Fidelity",
    text: "当前场景保留了原文的都市寂静感，但人物心理还可以再压抑一些。"
  },
  {
    title: "Pacing Warning",
    text: "台词后半段的信息量略集中，建议加一个短动作节拍做呼吸。"
  }
];

export const editorMeta = {
  dramaticPurpose: "Establish isolation and the atmospheric weight of the city.",
  storyFunction: "Push the protagonist to the edge of an irreversible choice."
};

export const aiSuggestion = "AI Suggestion: Increase tension by mentioning the driver's silhouette.";
