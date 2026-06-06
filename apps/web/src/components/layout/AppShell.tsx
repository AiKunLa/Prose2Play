import type { PropsWithChildren } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import type { PageTab, SidebarKey, View } from "../../shared/types/navigation";

type AppShellProps = PropsWithChildren<{
  activeSidebarKey: SidebarKey;
  activeTab: PageTab;
  isEditor: boolean;
  view: View;
  onViewChange: (view: View) => void;
}>;

export function AppShell({
  activeSidebarKey,
  activeTab,
  children,
  isEditor,
  view,
  onViewChange
}: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-transparent text-ink">
      <Sidebar activeKey={activeSidebarKey} />

      <div className="min-w-0 flex-1">
        <TopBar activeTab={activeTab} view={view} onViewChange={onViewChange} />

        {isEditor ? (
          children
        ) : (
          <main className="mx-auto w-full max-w-[1280px] px-5 py-9 pb-12 sm:px-6 lg:px-8">{children}</main>
        )}
      </div>
    </div>
  );
}
