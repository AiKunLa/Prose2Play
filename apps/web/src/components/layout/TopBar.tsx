import { pageTabs } from "../../shared/constants/navigation";
import { Icon } from "../../shared/icons/Icon";
import type { PageTab, View } from "../../shared/types/navigation";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";

type TopBarProps = {
  activeTab: PageTab;
  view: View;
  onViewChange: (view: View) => void;
};

export function TopBar({ activeTab, view, onViewChange }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex min-h-20 flex-wrap items-start justify-between gap-6 border-b border-border bg-bg/92 px-5 py-[18px] backdrop-blur-[18px] sm:px-6 xl:items-center xl:px-8">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <span className="rounded-full bg-ink/4 px-3 py-2 text-[0.78rem] font-semibold tracking-[0.02em] text-ink-soft">
          Project Alpha
        </span>
        <span className="rounded-full bg-accent-glow px-3 py-2 text-[0.78rem] font-semibold tracking-[0.02em] text-accent-deep">
          Status: Drafting
        </span>
      </div>

      <div
        aria-label="Workspace views"
        className="order-3 flex w-full min-w-0 flex-1 gap-2 overflow-x-auto pb-1 xl:order-none xl:justify-center"
        role="tablist"
      >
        {pageTabs.map((tab) => {
          const isActive = view === tab.id;

          return (
            <button
              key={tab.id}
              aria-selected={isActive}
              className={[
                "flex min-w-0 shrink-0 flex-col gap-0.5 rounded-full border px-3.5 py-2.5 text-left transition duration-200 hover:-translate-y-0.5",
                isActive
                  ? "border-border bg-white text-ink shadow-soft"
                  : "border-transparent bg-transparent text-ink-soft hover:bg-ink/4 hover:text-ink"
              ].join(" ")}
              onClick={() => onViewChange(tab.id)}
              role="tab"
              type="button"
            >
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                {tab.eyebrow}
              </span>
              <span className="truncate text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <IconButton aria-label="Notifications">
          <Icon name="bell" />
        </IconButton>
        <IconButton aria-label="Profile">
          <Icon name="user" />
        </IconButton>
        <Button variant="primary">
          <Icon name="play" />
          <span>{activeTab.id === "editor" ? "Preview" : "继续项目"}</span>
        </Button>
      </div>
    </header>
  );
}
