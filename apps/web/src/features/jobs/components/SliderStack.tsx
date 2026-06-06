import type { SliderMetric } from "../types";

type SliderStackProps = {
  metrics: SliderMetric[];
};

export function SliderStack({ metrics }: SliderStackProps) {
  return (
    <div className="grid gap-[18px]">
      {metrics.map((metric) => (
        <div key={metric.title}>
          <strong className="text-[0.95rem]">{metric.title}</strong>
          <p className="mb-2.5 mt-1.5 text-[0.88rem] text-ink-soft">{metric.description}</p>
          <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
            <span
              className="block h-full rounded-full bg-[linear-gradient(90deg,#ffcf57_0%,#ffbb17_60%,#d79600_100%)]"
              style={{ width: `${metric.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
