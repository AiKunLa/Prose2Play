export type DashboardStat = {
  label: string;
  value: string;
  delta: string;
  note: string;
};

export type RecentJob = {
  title: string;
  author: string;
  state: string;
  stateTone: "warning" | "success" | "info";
  time: string;
};
