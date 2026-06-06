import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { Icon } from "../../shared/icons/Icon";
import {
  dashboardBanner,
  dashboardHero,
  dashboardJobsSection,
  dashboardStats,
  recentJobs
} from "./data/dashboard";
import { RecentJobsTable } from "./components/RecentJobsTable";
import { StatCard } from "./components/StatCard";

type DashboardViewProps = {
  onOpenNewJob: () => void;
};

export function DashboardView({ onOpenNewJob }: DashboardViewProps) {
  return (
    <div className="grid gap-7">
      <section className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <Badge>{dashboardHero.badge}</Badge>
          <h1 className="mt-2.5 text-[clamp(2.6rem,4.4vw,4rem)] font-bold leading-[1.1] tracking-[-0.03em]">
            {dashboardHero.title}
          </h1>
          <p className="max-w-[720px] text-base leading-[1.75] text-ink-soft">{dashboardHero.description}</p>
        </div>

        <Button onClick={onOpenNewJob} size="large" variant="primary">
          <Icon name="plus" />
          <span>开始新建任务</span>
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </section>

      <Card>
        <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row">
          <SectionTitle description={dashboardJobsSection.description} title={dashboardJobsSection.title} />
          <Button variant="ghost">{dashboardJobsSection.actionLabel}</Button>
        </div>
        <RecentJobsTable jobs={recentJobs} />
      </Card>

      <section className="relative overflow-hidden rounded-[24px] border border-border bg-[linear-gradient(130deg,rgba(255,255,255,0.06),transparent_42%),linear-gradient(135deg,#0f0f0f_0%,#16120a_100%)] text-white shadow-soft">
        <div className="pointer-events-none absolute -right-20 -top-24 h-[220px] w-[220px] rounded-full bg-[rgba(255,187,23,0.12)] blur-[10px]" />
        <div className="pointer-events-none absolute bottom-[-80px] right-[60px] h-[180px] w-[180px] rounded-full border border-white/12 blur-[1px]" />
        <div className="relative z-[1] max-w-[540px] p-[30px]">
          <Badge tone="dark">{dashboardBanner.badge}</Badge>
          <h3 className="mt-4 text-[1.35rem] tracking-[-0.02em]">{dashboardBanner.title}</h3>
          <p className="mt-3 leading-8 text-white/72">{dashboardBanner.description}</p>
        </div>
      </section>
    </div>
  );
}
