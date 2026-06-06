import { Button } from "../../../components/ui/Button";
import { IconButton } from "../../../components/ui/IconButton";
import { Icon } from "../../../shared/icons/Icon";
import { analysisNotes, rewritePresets, sourceEvidence } from "../data/editor";

export function AnalysisPanel() {
  return (
    <aside className="hidden min-h-0 flex-col border-l border-border bg-white/84 xl:flex">
      <div className="flex items-center justify-between border-b border-border px-[18px] py-5">
        <p className="m-0 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-ink-faint">AI ANALYSIS</p>
        <IconButton aria-label="Search evidence" size="small">
          <Icon name="search" />
        </IconButton>
      </div>

      <div className="grid gap-3 overflow-auto p-4">
        <section className="rounded-[20px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,248,246,0.96))] p-[18px]">
          <div className="mb-3 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-ink-faint">
            SOURCE REFERENCE
          </div>
          {sourceEvidence.map((note) => (
            <blockquote
              className="mb-3 border-l-2 border-l-[rgba(255,187,23,0.4)] pl-3 text-sm leading-7 text-ink-soft last:mb-0"
              key={note}
            >
              {note}
            </blockquote>
          ))}
        </section>

        <section className="rounded-[20px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,248,246,0.96))] p-[18px]">
          <div className="mb-3 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-ink-faint">
            ADAPTATION INSIGHTS
          </div>
          {analysisNotes.map((item) => (
            <div
              className="mb-2.5 flex items-start gap-3 rounded-[18px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,248,246,0.96))] p-4 last:mb-0"
              key={item.title}
            >
              <div className="grid h-[38px] w-[38px] place-items-center rounded-xl bg-surface-warm text-accent-deep">
                <Icon name="warning" />
              </div>
              <div>
                <strong className="mb-1 block text-[0.95rem]">{item.title}</strong>
                <p className="text-sm leading-7 text-ink-soft">{item.text}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-[20px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,248,246,0.96))] p-[18px]">
          <div className="mb-3 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-ink-faint">
            REGENERATION PRESETS
          </div>
          <div className="flex flex-wrap gap-2.5">
            {rewritePresets.map((preset) => (
              <button
                className="rounded-full border border-border bg-white px-3.5 py-2.5 text-sm text-ink-soft transition duration-200 hover:-translate-y-0.5 hover:bg-surface-warm hover:text-accent-deep"
                key={preset}
                type="button"
              >
                {preset}
              </button>
            ))}
          </div>
          <Button className="mt-4" fullWidth variant="primary">
            <Icon name="magic" />
            <span>Smart Rewrite</span>
          </Button>
        </section>
      </div>
    </aside>
  );
}
