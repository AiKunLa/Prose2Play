import { Card } from "../../../components/ui/Card";
import type { DashboardStat } from "../types";

type StatCardProps = {
  stat: DashboardStat;
};

export function StatCard({ stat }: StatCardProps) {
  return (
    <Card className="p-[22px] pb-5" variant="glass">
      <div className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-ink-faint">{stat.label}</div>
      <div className="mt-2.5 flex items-baseline gap-2.5">
        <strong className="text-[2.2rem] font-bold tracking-[-0.04em]">{stat.value}</strong>
        <span className="text-[0.85rem] font-bold text-accent-deep">{stat.delta}</span>
      </div>
      <p className="mt-2 text-sm leading-7 text-ink-soft">{stat.note}</p>
    </Card>
  );
}
