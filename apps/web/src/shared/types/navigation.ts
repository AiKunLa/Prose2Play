import type { IconName } from "../icons/types";

export type View = "dashboard" | "new-job" | "detail" | "editor";

export type PageTab = {
  id: View;
  label: string;
  eyebrow?: string;
};

export type SidebarKey = "dashboard" | "jobs" | "settings";

export type SidebarItem = {
  key: SidebarKey;
  label: string;
  icon: IconName;
};
