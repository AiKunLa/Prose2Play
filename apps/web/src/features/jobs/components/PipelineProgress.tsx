import { Icon } from "../../../shared/icons/Icon";
import type { PipelineStage } from "../types";

type PipelineProgressProps = {
  progress: number;
  stages: PipelineStage[];
};

export function PipelineProgress({ progress, stages }: PipelineProgressProps) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-border bg-white/88 px-[26px] pb-[26px] pt-8 shadow-soft backdrop-blur-[18px]">
      <div className="-mx-[26px] -mt-8 mb-[26px] h-1 overflow-hidden bg-ink/4">
        <span className="block h-full bg-[linear-gradient(90deg,#ffbb17_0%,#111111_100%)]" style={{ width: `${progress}%` }} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-3 xl:grid-cols-6">
        {stages.map((stage) => {
          const iconClass = stage.done
            ? stage.active
              ? "border-[rgba(255,187,23,0.4)] bg-accent text-[#111] shadow-[0_0_0_8px_rgba(255,187,23,0.14)]"
              : "border-ink bg-ink text-white"
            : "border-border bg-surface-soft text-ink-faint";

          return (
            <div className="grid justify-items-center gap-2.5" key={stage.label}>
              <div className={["grid h-[42px] w-[42px] place-items-center rounded-full border", iconClass].join(" ")}>
                {stage.done ? <Icon name="check" /> : <span />}
              </div>
              <span className="text-[0.85rem] font-semibold">{stage.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
