import { Icon } from "../../../shared/icons/Icon";
import { IconButton } from "../../../components/ui/IconButton";
import type { Scene } from "../types";

type SceneNavigatorProps = {
  currentSceneId: string;
  scenes: Scene[];
  onSceneSelect: (sceneId: string) => void;
};

export function SceneNavigator({ currentSceneId, onSceneSelect, scenes }: SceneNavigatorProps) {
  return (
    <nav aria-label="Scene navigator" className="hidden min-h-0 flex-col bg-white/84 lg:flex">
      <div className="flex items-center justify-between border-b border-border px-[18px] py-5">
        <p className="m-0 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-ink-faint">SCENE NAVIGATOR</p>
        <IconButton aria-label="Filter scenes" size="small">
          <Icon name="filter" />
        </IconButton>
      </div>

      <div className="grid gap-2 overflow-auto p-4">
        {scenes.map((scene) => {
          const isActive = scene.id === currentSceneId;

          return (
            <button
              className={[
                "grid gap-2 rounded-[18px] border p-3.5 text-left transition duration-200 hover:-translate-y-0.5 hover:bg-surface-soft",
                isActive ? "border-border bg-surface-warm" : "border-transparent bg-transparent"
              ].join(" ")}
              key={scene.id}
              onClick={() => onSceneSelect(scene.id)}
              type="button"
            >
              <div className="flex items-center justify-between text-[0.78rem] font-bold tracking-[0.08em] text-ink-faint">
                <span>{scene.slug}</span>
                {scene.status === "locked" ? <Icon name="lock" /> : null}
              </div>
              <strong className="mb-1 block text-[0.95rem]">{scene.title}</strong>
              <p className="text-[0.78rem] text-ink-faint">{scene.summary}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex items-center gap-3 border-t border-border px-4 pb-4 pt-[18px]">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#111111,#3a3a3a)] text-sm font-bold text-white">
          A
        </div>
        <div>
          <div className="text-sm font-semibold">Alex Chen</div>
          <div className="text-[0.74rem] uppercase tracking-[0.08em] text-ink-faint">Premium Plan</div>
        </div>
      </div>
    </nav>
  );
}
