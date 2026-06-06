import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { DashboardView } from "../features/dashboard/DashboardView";
import { EditorView } from "../features/editor/EditorView";
import { scenes } from "../features/editor/data/editor";
import { DetailView } from "../features/jobs/DetailView";
import { NewJobView } from "../features/jobs/NewJobView";
import { pageTabs } from "../shared/constants/navigation";
import type { SidebarKey, View } from "../shared/types/navigation";

function resolveSidebarKey(view: View): SidebarKey {
  if (view === "dashboard") {
    return "dashboard";
  }

  if (view === "new-job" || view === "detail" || view === "editor") {
    return "jobs";
  }

  return "settings";
}

export function App() {
  const [view, setView] = useState<View>("dashboard");
  const [currentSceneId, setCurrentSceneId] = useState<string>(scenes[0]?.id ?? "");

  const activeSidebarKey = resolveSidebarKey(view);
  const activeTab = pageTabs.find((tab) => tab.id === view) ?? pageTabs[0];
  const currentScene = scenes.find((scene) => scene.id === currentSceneId) ?? scenes[0];

  return (
    <AppShell
      activeSidebarKey={activeSidebarKey}
      activeTab={activeTab}
      isEditor={view === "editor"}
      view={view}
      onViewChange={setView}
    >
      {view === "dashboard" ? <DashboardView onOpenNewJob={() => setView("new-job")} /> : null}
      {view === "new-job" ? <NewJobView onContinue={() => setView("detail")} /> : null}
      {view === "detail" ? <DetailView onOpenEditor={() => setView("editor")} /> : null}
      {view === "editor" && currentScene ? (
        <EditorView currentScene={currentScene} onSceneSelect={setCurrentSceneId} />
      ) : null}
    </AppShell>
  );
}
