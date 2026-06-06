import type { IconName } from "../icons/types";
import type { PageTab, SidebarItem } from "../types/navigation";

export const pageTabs: PageTab[] = [
  { id: "dashboard", label: "工作控制台", eyebrow: "Overview" },
  { id: "new-job", label: "发起新改编任务", eyebrow: "Create" },
  { id: "detail", label: "改编项目详情", eyebrow: "Progress" },
  { id: "editor", label: "剧本编辑器", eyebrow: "Studio" }
];

export const sidebarItems: SidebarItem[] = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "jobs", label: "Adaptation Jobs", icon: "spark" },
  { key: "settings", label: "Settings", icon: "settings" }
];

export const utilityIcons: IconName[] = ["bell", "user", "play"];
