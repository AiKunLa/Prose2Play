import { sidebarItems } from "../../shared/constants/navigation";
import { Icon } from "../../shared/icons/Icon";
import type { SidebarKey } from "../../shared/types/navigation";

type SidebarProps = {
  activeKey: SidebarKey;
};

export function Sidebar({ activeKey }: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col gap-8 border-r border-border bg-white/82 px-[18px] py-7 backdrop-blur-[16px] xl:flex">
      <div className="flex items-center gap-3.5 px-2">
        <a
          aria-label="Prose2Play home"
          className="grid h-11 w-11 place-items-center rounded-[14px] bg-ink text-[1.2rem] font-bold text-accent shadow-soft"
          href="#root"
        >
          P
        </a>

        <div>
          <div className="text-[1.3rem] font-bold tracking-[-0.02em]">Prose2Play</div>
          <div className="text-xs text-ink-faint">AI Script Architect</div>
        </div>
      </div>

      <nav aria-label="Primary" className="grid gap-1.5">
        {sidebarItems.map((item) => {
          const isActive = item.key === activeKey;

          return (
            <button
              key={item.key}
              className={[
                "flex items-center gap-3 rounded-[14px] border px-3.5 py-3.5 text-left text-sm transition duration-200 hover:-translate-y-0.5 hover:bg-surface-soft hover:text-ink",
                isActive
                  ? "border-border bg-surface-warm text-accent-deep shadow-[inset_2px_0_0_0_var(--color-accent)]"
                  : "border-transparent bg-transparent text-ink-soft"
              ].join(" ")}
              type="button"
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 border-t border-border px-2 pt-[18px]">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#111111,#3a3a3a)] text-sm font-bold text-white">
          梁
        </div>
        <div>
          <div className="text-sm font-semibold">导演工作台</div>
          <div className="text-[0.74rem] uppercase tracking-[0.08em] text-ink-faint">Creator Tier</div>
        </div>
      </div>
    </aside>
  );
}
