import { Icon } from "../../../shared/icons/Icon";
import { IconButton } from "../../../components/ui/IconButton";
import { StatusPill } from "../../../components/ui/StatusPill";
import type { RecentJob } from "../types";

type RecentJobsTableProps = {
  jobs: RecentJob[];
};

export function RecentJobsTable({ jobs }: RecentJobsTableProps) {
  return (
    <div className="grid">
      <div className="hidden grid-cols-[minmax(0,2.4fr)_minmax(120px,1fr)_minmax(110px,0.9fr)_40px] gap-3 border-t border-border px-1.5 py-[18px] text-[0.74rem] font-bold uppercase tracking-[0.08em] text-ink-faint md:grid">
        <span>项目名称</span>
        <span>状态</span>
        <span>时间戳</span>
        <span />
      </div>

      {jobs.map((job) => (
        <div
          className="grid grid-cols-1 gap-3 border-t border-border px-1.5 py-[18px] md:grid-cols-[minmax(0,2.4fr)_minmax(120px,1fr)_minmax(110px,0.9fr)_40px] md:items-center"
          key={job.title}
        >
          <div>
            <strong className="mb-1 block text-[0.95rem]">{job.title}</strong>
            <p className="text-[0.84rem] text-ink-faint">{job.author}</p>
          </div>
          <StatusPill tone={job.stateTone}>{job.state}</StatusPill>
          <span className="text-[0.84rem] text-ink-faint">{job.time}</span>
          <IconButton aria-label="More actions" className="justify-self-start md:justify-self-auto" size="small">
            <Icon name="dots" />
          </IconButton>
        </div>
      ))}
    </div>
  );
}
