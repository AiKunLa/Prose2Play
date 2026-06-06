import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { Icon } from "../../shared/icons/Icon";
import { detailContent, detailMetrics, pipelineStages, roleCards, yamlPreview } from "./data/jobs";
import { PipelineProgress } from "./components/PipelineProgress";
import { RoleCardGrid } from "./components/RoleCardGrid";

type DetailViewProps = {
  onOpenEditor: () => void;
};

export function DetailView({ onOpenEditor }: DetailViewProps) {
  return (
    <div className="grid gap-7">
      <section className="flex flex-col items-start justify-between gap-6 lg:flex-row">
        <div>
          <Badge>{detailContent.badge}</Badge>
          <h1 className="mt-2.5 text-[clamp(2rem,3vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em]">
            {detailContent.title}
          </h1>
          <p className="max-w-[720px] text-base leading-[1.75] text-ink-soft">{detailContent.description}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={onOpenEditor} variant="primary">
            <Icon name="edit" />
            <span>打开编辑器</span>
          </Button>
          <Button variant="ghost">
            <Icon name="code" />
            <span>导出 YAML</span>
          </Button>
        </div>
      </section>

      <PipelineProgress progress={72} stages={pipelineStages} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {detailMetrics.map((metric) => (
          <Card className="p-6" key={metric.label} variant="glass">
            <div className="text-[0.76rem] font-bold uppercase tracking-[0.1em] text-ink-faint">{metric.label}</div>
            <strong className="mt-2 block text-[2.2rem] font-bold tracking-[-0.04em]">{metric.value}</strong>
            <p className="mt-2 text-sm leading-7 text-ink-soft">{metric.description}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.92fr)]">
        <Card>
          <div className="mb-5">
            <SectionTitle title="质量分析" description="来自当前 drafting 阶段的结构评估。" />
          </div>

          <div className="grid gap-3">
            {roleCards.map((card) => (
              <div
                className="flex items-start gap-3 rounded-[18px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,248,246,0.96))] p-4"
                key={card.title}
              >
                <div className="grid h-[38px] w-[38px] place-items-center rounded-xl bg-surface-warm text-accent-deep">
                  <Icon name="magic" />
                </div>
                <div>
                  <strong className="mb-1 block text-[0.95rem]">{card.title}</strong>
                  <p className="text-sm leading-7 text-ink-soft">{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-5">
            <SectionTitle title="YAML 预览" description="结构化剧本输出的当前快照。" />
          </div>

          <pre className="m-0 overflow-auto rounded-[18px] bg-[#121212] p-5 font-mono text-[0.85rem] leading-[1.7] text-[#f0f0f0]">
            {yamlPreview}
          </pre>
        </Card>
      </section>

      <RoleCardGrid cards={roleCards} />
    </div>
  );
}
