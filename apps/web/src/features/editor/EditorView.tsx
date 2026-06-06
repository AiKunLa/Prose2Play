import { AnalysisPanel } from "./components/AnalysisPanel";
import { EditorScriptPanel } from "./components/EditorScriptPanel";
import { SceneNavigator } from "./components/SceneNavigator";
import { scenes } from "./data/editor";
import type { Scene } from "./types";

type EditorViewProps = {
  currentScene: Scene;
  onSceneSelect: (sceneId: string) => void;
};

export function EditorView({ currentScene, onSceneSelect }: EditorViewProps) {
  return (
    <section className="grid min-h-[calc(100vh-var(--topbar-height))] grid-cols-1 bg-transparent lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_320px]">
      <SceneNavigator currentSceneId={currentScene.id} onSceneSelect={onSceneSelect} scenes={scenes} />
      <EditorScriptPanel scene={currentScene} />
      <AnalysisPanel />
    </section>
  );
}
