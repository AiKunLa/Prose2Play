import type { DashboardStat, RecentJob } from "../types";

export const dashboardHero = {
  badge: "Status: Drafting",
  title: "欢迎回来，创作者。",
  description:
    "你的剧本工作台仍在推进中。今天我们继续把小说文本转成更清晰的舞台呈现、镜头节奏与结构化脚本输出。"
};

export const dashboardStats: DashboardStat[] = [
  {
    label: "总场景数",
    value: "124",
    delta: "+12%",
    note: "比上周更快进入成稿节奏"
  },
  {
    label: "总角色数",
    value: "892",
    delta: "+8%",
    note: "过去 30 天持续活跃"
  },
  {
    label: "待修订点",
    value: "312",
    delta: "-5%",
    note: "相当于 39 个工作日"
  }
];

export const recentJobs: RecentJob[] = [
  {
    title: "《三体》第一集改编",
    author: "科幻长篇",
    state: "正常交付",
    stateTone: "warning",
    time: "2 分钟前"
  },
  {
    title: "乡土记忆现代短片",
    author: "乡村 · 短片",
    state: "已完成",
    stateTone: "success",
    time: "3 小时前"
  },
  {
    title: "雨夜谜案关系场",
    author: "悬疑 · 片段集",
    state: "进行中",
    stateTone: "info",
    time: "昨天 14:30"
  }
];

export const dashboardJobsSection = {
  title: "近期改编任务",
  description: "继续打磨最接近成稿的项目。",
  actionLabel: "查看全部"
};

export const dashboardBanner = {
  badge: "高光能力模块",
  title: "让 AI 先做结构，再由创作者接管风格。",
  description:
    "Prose2Play 的目标不是替代写作，而是把复杂的改编流程压缩成更可控、更可回溯的创作协作。"
};
