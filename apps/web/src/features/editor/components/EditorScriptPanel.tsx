import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Icon } from "../../../shared/icons/Icon";
import { aiSuggestion, editorMeta, sceneBlocks } from "../data/editor";
import type { Scene } from "../types";

type EditorScriptPanelProps = {
  scene: Scene;
};

export function EditorScriptPanel({ scene }: EditorScriptPanelProps) {
  return (
    <div className="overflow-y-auto border-x border-border bg-white/84">
      <div className="mx-auto max-w-[760px] px-5 pb-14 pt-[42px] sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <Badge>{scene.slug}</Badge>
          <div className="flex flex-wrap gap-3">
            <Button variant="text">
              <Icon name="refresh" />
              <span>Regenerate Scene</span>
            </Button>
            <Button variant="text">
              <Icon name="wand" />
              <span>Fix Structure</span>
            </Button>
          </div>
        </div>

        <div className="mb-[18px] mt-5 text-[clamp(2.2rem,4vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.04em]">
          {scene.title}
        </div>

        <div className="flex flex-col items-start gap-6 border-b border-border pb-[22px] md:flex-row">
          <div className="flex-1">
            <div className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-ink-faint">Dramatic Purpose</div>
            <p className="mt-2 text-sm leading-7 text-ink-soft">{editorMeta.dramaticPurpose}</p>
          </div>
          <div className="flex-1">
            <div className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-ink-faint">Story Function</div>
            <p className="mt-2 text-sm leading-7 text-ink-soft">{editorMeta.storyFunction}</p>
          </div>
        </div>

        {sceneBlocks.map((block) => (
          <article
            className="mt-[18px] rounded-[20px] border border-[rgba(229,229,229,0.92)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,248,246,0.84))] px-6 py-[22px]"
            key={block}
          >
            <p className="m-0 whitespace-pre-line text-[1.02rem] leading-[1.9] text-[#2d2d2d]">{block}</p>
          </article>
        ))}

        <div className="mt-[18px] flex flex-col items-start justify-between gap-3 rounded-[18px] bg-surface-warm px-4 py-3.5 text-[0.84rem] text-ink-soft md:flex-row md:items-center">
          <span>{aiSuggestion}</span>
          <Button variant="accent">Apply Fix</Button>
        </div>
      </div>
    </div>
  );
}
