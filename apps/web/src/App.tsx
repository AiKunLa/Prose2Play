import { useState } from "react";

type View = "dashboard" | "new-job" | "detail" | "editor";

type NavItem = {
  id: View;
  label: string;
  eyebrow?: string;
};

type SidebarItem = {
  key: "dashboard" | "jobs" | "settings";
  label: string;
  icon: IconName;
};

type IconName =
  | "dashboard"
  | "spark"
  | "settings"
  | "bell"
  | "user"
  | "plus"
  | "dots"
  | "play"
  | "upload"
  | "document"
  | "check"
  | "clock"
  | "warning"
  | "edit"
  | "magic"
  | "filter"
  | "search"
  | "code"
  | "group"
  | "refresh"
  | "wand"
  | "book"
  | "lock"
  | "arrow";

type Scene = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: string;
};

const pageTabs: NavItem[] = [
  { id: "dashboard", label: "工作控制台", eyebrow: "Overview" },
  { id: "new-job", label: "发起新改编任务", eyebrow: "Create" },
  { id: "detail", label: "改编项目详情", eyebrow: "Progress" },
  { id: "editor", label: "剧本编辑器", eyebrow: "Studio" }
];

const sidebarItems: SidebarItem[] = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "jobs", label: "Adaptation Jobs", icon: "spark" },
  { key: "settings", label: "Settings", icon: "settings" }
];

const dashboardStats = [
  { label: "总场景数", value: "124", delta: "+12%", note: "比上周更快进入成稿" },
  { label: "总字数", value: "892", delta: "+8%", note: "过去 30 天持续活跃" },
  { label: "待修订点", value: "312", delta: "-5%", note: "相当于 39 个工作日" }
];

const recentJobs = [
  {
    title: "《三体》第一集改编",
    author: "科幻长篇",
    state: "正常交付",
    stateTone: "warning",
    time: "2 分钟前"
  },
  {
    title: "乡土记忆现代短片",
    author: "乡村·短片",
    state: "已完成",
    stateTone: "success",
    time: "3 小时前"
  },
  {
    title: "雨夜迷案关系戏",
    author: "悬疑·片段本",
    state: "进行中",
    stateTone: "info",
    time: "昨天 14:30"
  }
];

const uploadChapters = [
  { name: "chapter-01.md", size: "18 KB", status: "已导入" },
  { name: "chapter-02.md", size: "24 KB", status: "待解析" },
  { name: "chapter-03.md", size: "21 KB", status: "已校验" }
];

const pipelineStages = [
  { label: "导入", done: true },
  { label: "分析", done: true },
  { label: "规划", done: true },
  { label: "起草", done: true, active: true },
  { label: "校验", done: false },
  { label: "修复", done: false }
];

const roleCards = [
  {
    title: "主角弧线",
    text: "冷感理性逐渐被责任与信任撬开，情绪释放节点落在 rooftop confrontation。"
  },
  {
    title: "反派动机",
    text: "将“控制城市叙事”的野心从结果层，前置到对记忆垄断的执念。"
  },
  {
    title: "节奏风险",
    text: "Scene 07 到 Scene 09 的信息密度过高，建议拆分为动作 beats 与心理 beats。"
  }
];

const scenes: Scene[] = [
  {
    id: "scene-01",
    slug: "SCENE 01",
    title: "EXT. CITY STREET - NIGHT",
    summary: "雨夜街景奠定氛围，并引入主人公的迟疑。",
    status: "locked"
  },
  {
    id: "scene-02",
    slug: "SCENE 02",
    title: "INT. APARTMENT - CONTINUOUS",
    summary: "角色进入私密空间，外部冲突转为内在张力。",
    status: "draft"
  },
  {
    id: "scene-03",
    slug: "SCENE 03",
    title: "INT. COFFEE SHOP - DAY",
    summary: "重要信息在轻松对话中被抛出。",
    status: "draft"
  },
  {
    id: "scene-04",
    slug: "SCENE 04",
    title: "EXT. ROOFTOP - NIGHT",
    summary: "阶段性对抗升级，为转折点蓄力。",
    status: "draft"
  }
];

const sourceEvidence = [
  "原文在第 12 节明确描写主角在雨中停留，表现其对即将行动的迟疑。",
  "街面霓虹、雨幕与闭店影院构成视觉母题，适合延展为都市冷感镜头语言。",
  "香烟与车灯的并置，在原著里承担“决定前最后一秒”的心理提示。"
];

const rewritePresets = ["More Dynamic", "Subtle Tension", "Faster Pacing", "Noir Dialog"];

const analysisNotes = [
  {
    title: "Atmospheric Fidelity",
    text: "当前场景保留了原文的都市寂静感，但人物心理还可以再压抑一些。"
  },
  {
    title: "Pacing Warning",
    text: "台词后半段的信息量略集中，建议加一个短动作节拍做呼吸。"
  }
];

const sceneBlocks = [
  "Rain slicked pavement reflects the neon hum of a dying district. Xander stands under the skeletal awning of a closed cinema, smoke curling from his lips in slow, deliberate spirals.",
  "XANDER\n(to himself)\nThey always said the weather would turn before the deal did.",
  "A black sedan rolls silently to the curb. The headlights cut through the mist, two blinding white eyes in the dark. Xander drops the cigarette."
];

function resolveSidebarKey(view: View): SidebarItem["key"] {
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
  const [currentScene, setCurrentScene] = useState<string>(scenes[0].id);

  const activeSidebarKey = resolveSidebarKey(view);
  const activeTab = pageTabs.find((tab) => tab.id === view) ?? pageTabs[0];
  const selectedScene = scenes.find((scene) => scene.id === currentScene) ?? scenes[0];

  return (
    <div className="app-shell">
      <Sidebar activeKey={activeSidebarKey} />

      <div className="workspace-shell">
        <TopBar activeTab={activeTab} view={view} onViewChange={setView} />

        {view === "editor" ? (
          <EditorView
            currentScene={selectedScene}
            onSceneSelect={setCurrentScene}
          />
        ) : (
          <main className="canvas">
            {view === "dashboard" ? <DashboardView onOpenNewJob={() => setView("new-job")} /> : null}
            {view === "new-job" ? <NewJobView onContinue={() => setView("detail")} /> : null}
            {view === "detail" ? <DetailView onOpenEditor={() => setView("editor")} /> : null}
          </main>
        )}
      </div>
    </div>
  );
}

function Sidebar({ activeKey }: { activeKey: SidebarItem["key"] }) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <a className="brand-mark" href="#root" aria-label="Prose2Play home">
          <span className="brand-mark__icon">P</span>
        </a>
        <div>
          <div className="brand-title">Prose2Play</div>
          <div className="brand-subtitle">AI Script Architect</div>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            className={item.key === activeKey ? "nav-item is-active" : "nav-item"}
            type="button"
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="profile-card">
        <div className="profile-avatar">李</div>
        <div>
          <div className="profile-name">导演工作台</div>
          <div className="profile-plan">Creator Tier</div>
        </div>
      </div>
    </aside>
  );
}

function TopBar({
  activeTab,
  view,
  onViewChange
}: {
  activeTab: NavItem;
  view: View;
  onViewChange: (view: View) => void;
}) {
  return (
    <header className="topbar">
      <div className="topbar__meta">
        <span className="project-tag">Project Alpha</span>
        <span className="project-status">Status: Drafting</span>
      </div>

      <div className="topbar__switcher" role="tablist" aria-label="Workspace views">
        {pageTabs.map((tab) => (
          <button
            key={tab.id}
            aria-selected={view === tab.id}
            className={view === tab.id ? "view-tab is-active" : "view-tab"}
            onClick={() => onViewChange(tab.id)}
            role="tab"
            type="button"
          >
            <span className="view-tab__eyebrow">{tab.eyebrow}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="topbar__actions">
        <button className="icon-button" type="button" aria-label="Notifications">
          <Icon name="bell" />
        </button>
        <button className="icon-button" type="button" aria-label="Profile">
          <Icon name="user" />
        </button>
        <button className="primary-button" type="button">
          <Icon name="play" />
          <span>{activeTab.id === "editor" ? "Preview" : "继续项目"}</span>
        </button>
      </div>
    </header>
  );
}

function DashboardView({ onOpenNewJob }: { onOpenNewJob: () => void }) {
  return (
    <div className="page-stack">
      <section className="hero-row">
        <div>
          <div className="eyebrow-chip">Status: Drafting</div>
          <h1 className="display-title">欢迎回来，创作者。</h1>
          <p className="hero-copy">
            您的剧本化系统仍在进化。今天我们将继续把文字转化为精炼的舞台呈现与镜头节奏。
          </p>
        </div>

        <button className="primary-button primary-button--large" onClick={onOpenNewJob} type="button">
          <Icon name="plus" />
          <span>开始新建任务</span>
        </button>
      </section>

      <section className="stats-grid">
        {dashboardStats.map((item) => (
          <article key={item.label} className="glass-card stat-card">
            <div className="muted-label">{item.label}</div>
            <div className="stat-card__value-row">
              <strong>{item.value}</strong>
              <span>{item.delta}</span>
            </div>
            <p>{item.note}</p>
          </article>
        ))}
      </section>

      <section className="section-card">
        <div className="section-card__header">
          <div>
            <h2>近期改编任务</h2>
            <p>继续打磨最接近成稿的项目。</p>
          </div>
          <button className="ghost-button" type="button">
            查看全部
          </button>
        </div>

        <div className="jobs-table">
          <div className="jobs-row jobs-row--head">
            <span>项目名称</span>
            <span>状态</span>
            <span>时间戳</span>
            <span />
          </div>
          {recentJobs.map((job) => (
            <div className="jobs-row" key={job.title}>
              <div>
                <strong>{job.title}</strong>
                <p>{job.author}</p>
              </div>
              <div className={`status-pill status-pill--${job.stateTone}`}>
                <span className="status-dot" />
                <span>{job.state}</span>
              </div>
              <span className="row-muted">{job.time}</span>
              <button className="icon-button icon-button--small" type="button" aria-label="More actions">
                <Icon name="dots" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="banner-card">
        <div className="banner-card__content">
          <div className="eyebrow-chip eyebrow-chip--dark">高光能力模块</div>
          <h3>让 AI 先做结构，再由创作者接管风格。</h3>
          <p>
            Prose2Play 的目标不是替代写作，而是把复杂的改编流程压缩成更可控、更可回溯的创作协作。
          </p>
        </div>
      </section>
    </div>
  );
}

function NewJobView({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="page-stack">
      <section className="hero-row hero-row--aligned-start">
        <div>
          <div className="eyebrow-chip">Create New Job</div>
          <h1 className="page-title">发起新改编任务</h1>
          <p className="hero-copy">
            通过原文、调性与约束条件，定义本次改编的生成边界。Stitch 设计稿中的双栏编辑结构已在这里还原。
          </p>
        </div>
      </section>

      <section className="two-column-layout">
        <div className="column-main">
          <article className="section-card">
            <div className="section-card__header section-card__header--compact">
              <div>
                <h2>项目设定</h2>
                <p>用清晰的创作目标约束生成结果。</p>
              </div>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>项目名称</span>
                <input defaultValue="Project Alpha · 雨城迷案" type="text" />
              </label>
              <label className="field">
                <span>目标时长</span>
                <input defaultValue="45 分钟 / 单集" type="text" />
              </label>
              <label className="field field--full">
                <span>改编简介</span>
                <textarea
                  defaultValue="把悬疑小说前三章改编为高压、克制、偏电影感的试播集开场。保留都市湿冷氛围，增强人物之间的暗流。"
                  rows={5}
                />
              </label>
              <div className="field field--full">
                <span>受众方向</span>
                <div className="chip-row">
                  <button className="choice-chip is-active" type="button">
                    电影感悬疑
                  </button>
                  <button className="choice-chip" type="button">
                    平台短剧
                  </button>
                  <button className="choice-chip" type="button">
                    青年向群像
                  </button>
                </div>
              </div>
            </div>
          </article>

          <article className="section-card">
            <div className="section-card__header section-card__header--compact">
              <div>
                <h2>章节上传</h2>
                <p>上传原文并校验格式，之后可进入分析阶段。</p>
              </div>
              <button className="ghost-button" type="button">
                <Icon name="upload" />
                <span>上传章节</span>
              </button>
            </div>

            <div className="upload-list">
              {uploadChapters.map((chapter) => (
                <div className="upload-item" key={chapter.name}>
                  <div className="upload-item__icon">
                    <Icon name="document" />
                  </div>
                  <div className="upload-item__body">
                    <strong>{chapter.name}</strong>
                    <p>{chapter.size}</p>
                  </div>
                  <span className="upload-item__status">{chapter.status}</span>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="column-side">
          <article className="section-card sticky-card">
            <div className="section-card__header section-card__header--compact">
              <div>
                <h2>AI 设定</h2>
                <p>设计稿中的右侧智能控制卡。</p>
              </div>
            </div>

            <div className="slider-stack">
              <div className="slider-row">
                <div>
                  <strong>情绪张力</strong>
                  <p>更靠近克制与压抑。</p>
                </div>
                <div className="slider-meter">
                  <span style={{ width: "78%" }} />
                </div>
              </div>
              <div className="slider-row">
                <div>
                  <strong>镜头感</strong>
                  <p>突出环境、停顿与动作切分。</p>
                </div>
                <div className="slider-meter">
                  <span style={{ width: "64%" }} />
                </div>
              </div>
              <div className="slider-row">
                <div>
                  <strong>原文忠实度</strong>
                  <p>优先保留情节事实，再润色节奏。</p>
                </div>
                <div className="slider-meter">
                  <span style={{ width: "86%" }} />
                </div>
              </div>
            </div>

            <div className="divider" />

            <div className="note-card">
              <div className="muted-label">推荐工作流</div>
              <p>导入三章原文后，先运行 `analysis + planning`，确认人物弧线后再进入 `drafting`。</p>
            </div>

            <button className="primary-button primary-button--full" onClick={onContinue} type="button">
              <span>创建并进入项目详情</span>
              <Icon name="arrow" />
            </button>
          </article>
        </div>
      </section>
    </div>
  );
}

function DetailView({ onOpenEditor }: { onOpenEditor: () => void }) {
  return (
    <div className="page-stack">
      <section className="hero-row hero-row--detail">
        <div>
          <div className="eyebrow-chip">In Progress</div>
          <h1 className="page-title">改编项目详情</h1>
          <p className="hero-copy">
            项目正处于起草阶段，结构和语气已经稳定，接下来重点是检查节奏、角色动机与 YAML 输出的一致性。
          </p>
        </div>

        <div className="hero-actions">
          <button className="primary-button" onClick={onOpenEditor} type="button">
            <Icon name="edit" />
            <span>打开编辑器</span>
          </button>
          <button className="ghost-button" type="button">
            <Icon name="code" />
            <span>导出 YAML</span>
          </button>
        </div>
      </section>

      <section className="section-card section-card--progress">
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: "72%" }} />
        </div>
        <div className="progress-steps">
          {pipelineStages.map((stage) => (
            <div className="progress-step" key={stage.label}>
              <div
                className={
                  stage.done
                    ? stage.active
                      ? "progress-step__icon is-active"
                      : "progress-step__icon is-done"
                    : "progress-step__icon"
                }
              >
                {stage.done ? <Icon name="check" /> : <span />}
              </div>
              <span>{stage.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="stats-grid">
        <article className="glass-card metric-card">
          <div className="metric-card__label">草稿完整度</div>
          <strong>80%</strong>
          <p>Scene 01-08 已生成，09-10 等待校验。</p>
        </article>
        <article className="glass-card metric-card">
          <div className="metric-card__label">质量风险</div>
          <strong>03</strong>
          <p>主要集中在人物语气一致性与节奏压缩。</p>
        </article>
        <article className="glass-card metric-card">
          <div className="metric-card__label">开放问题</div>
          <strong>07</strong>
          <p>涉及桥接剧情是否需要额外来源标注。</p>
        </article>
      </section>

      <section className="detail-grid">
        <article className="section-card">
          <div className="section-card__header">
            <div>
              <h2>质量分析</h2>
              <p>来自当前 drafting 阶段的结构评估。</p>
            </div>
          </div>

          <div className="analysis-list">
            {roleCards.map((card) => (
              <div className="analysis-item" key={card.title}>
                <div className="analysis-item__icon">
                  <Icon name="magic" />
                </div>
                <div>
                  <strong>{card.title}</strong>
                  <p>{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="section-card">
          <div className="section-card__header">
            <div>
              <h2>YAML 预览</h2>
              <p>结构化剧本输出的当前快照。</p>
            </div>
          </div>

          <pre className="yaml-panel">{`scene_id: scene-01
heading: "EXT. CITY STREET - NIGHT"
purpose: "Introduce the protagonist under pressure"
source_refs:
  - chapter: 1
    paragraphs: [14, 15, 16]
beats:
  - id: beat-01
    type: atmosphere
    summary: "Rain, neon, closed cinema facade"
  - id: beat-02
    type: action
    summary: "Black sedan arrives, forcing decision"`}</pre>
        </article>
      </section>

      <section className="role-grid">
        {roleCards.map((card) => (
          <article className="glass-card role-card" key={card.title}>
            <div className="role-card__icon">
              <Icon name="group" />
            </div>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

function EditorView({
  currentScene,
  onSceneSelect
}: {
  currentScene: Scene;
  onSceneSelect: (sceneId: string) => void;
}) {
  return (
    <section className="editor-shell">
      <nav className="editor-panel editor-panel--left" aria-label="Scene navigator">
        <div className="editor-panel__header">
          <div>
            <p className="panel-eyebrow">SCENE NAVIGATOR</p>
          </div>
          <button className="icon-button icon-button--small" type="button" aria-label="Filter scenes">
            <Icon name="filter" />
          </button>
        </div>

        <div className="scene-list">
          {scenes.map((scene) => (
            <button
              className={scene.id === currentScene.id ? "scene-card is-active" : "scene-card"}
              key={scene.id}
              onClick={() => onSceneSelect(scene.id)}
              type="button"
            >
              <div className="scene-card__topline">
                <span>{scene.slug}</span>
                {scene.status === "locked" ? <Icon name="lock" /> : null}
              </div>
              <strong>{scene.title}</strong>
              <p>{scene.summary}</p>
            </button>
          ))}
        </div>

        <div className="profile-card profile-card--editor">
          <div className="profile-avatar">A</div>
          <div>
            <div className="profile-name">Alex Chen</div>
            <div className="profile-plan">Premium Plan</div>
          </div>
        </div>
      </nav>

      <div className="editor-main">
        <div className="editor-main__inner">
          <div className="editor-header">
            <div className="eyebrow-chip">SCENE 01</div>
            <div className="editor-header__actions">
              <button className="text-button" type="button">
                <Icon name="refresh" />
                <span>Regenerate Scene</span>
              </button>
              <button className="text-button" type="button">
                <Icon name="wand" />
                <span>Fix Structure</span>
              </button>
            </div>
          </div>

          <div className="editor-scene-title">{currentScene.title}</div>

          <div className="editor-meta">
            <div>
              <div className="muted-label">Dramatic Purpose</div>
              <p>Establish isolation and the atmospheric weight of the city.</p>
            </div>
            <div>
              <div className="muted-label">Story Function</div>
              <p>Push the protagonist to the edge of an irreversible choice.</p>
            </div>
          </div>

          {sceneBlocks.map((block) => (
            <article className="script-block" key={block}>
              <p>{block}</p>
            </article>
          ))}

          <div className="editor-footnote">
            <span>AI Suggestion: Increase tension by mentioning the driver's silhouette.</span>
            <button className="accent-button" type="button">
              Apply Fix
            </button>
          </div>
        </div>
      </div>

      <aside className="editor-panel editor-panel--right">
        <div className="editor-panel__header">
          <div>
            <p className="panel-eyebrow">AI ANALYSIS</p>
          </div>
          <button className="icon-button icon-button--small" type="button" aria-label="Search evidence">
            <Icon name="search" />
          </button>
        </div>

        <div className="editor-stack">
          <section className="analysis-box">
            <div className="analysis-box__title">SOURCE REFERENCE</div>
            {sourceEvidence.map((note) => (
              <blockquote key={note}>{note}</blockquote>
            ))}
          </section>

          <section className="analysis-box">
            <div className="analysis-box__title">ADAPTATION INSIGHTS</div>
            {analysisNotes.map((item) => (
              <div className="insight-row" key={item.title}>
                <div className="insight-row__icon">
                  <Icon name="warning" />
                </div>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="analysis-box">
            <div className="analysis-box__title">REGENERATION PRESETS</div>
            <div className="preset-grid">
              {rewritePresets.map((preset) => (
                <button className="choice-chip" key={preset} type="button">
                  {preset}
                </button>
              ))}
            </div>
            <button className="primary-button primary-button--full" type="button">
              <Icon name="magic" />
              <span>Smart Rewrite</span>
            </button>
          </section>
        </div>
      </aside>
    </section>
  );
}

function Icon({ name }: { name: IconName }) {
  return (
    <svg aria-hidden="true" className="icon" viewBox="0 0 24 24" fill="none">
      {renderIconPath(name)}
    </svg>
  );
}

function renderIconPath(name: IconName) {
  const common = {
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8
  };

  switch (name) {
    case "dashboard":
      return (
        <>
          <rect x="3" y="3" width="8" height="8" rx="2" {...common} />
          <rect x="13" y="3" width="8" height="5" rx="2" {...common} />
          <rect x="13" y="10" width="8" height="11" rx="2" {...common} />
          <rect x="3" y="13" width="8" height="8" rx="2" {...common} />
        </>
      );
    case "spark":
      return (
        <>
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" {...common} />
          <path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z" {...common} />
        </>
      );
    case "settings":
      return (
        <>
          <circle cx="12" cy="12" r="3" {...common} />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.1a1 1 0 0 0-.7-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.1a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.1a1 1 0 0 0 .6.9h.1a1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.1a1 1 0 0 0-.9.6Z" {...common} />
        </>
      );
    case "bell":
      return (
        <>
          <path d="M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7Z" {...common} />
          <path d="M10 19a2 2 0 0 0 4 0" {...common} />
        </>
      );
    case "user":
      return (
        <>
          <circle cx="12" cy="8" r="4" {...common} />
          <path d="M5 20a7 7 0 0 1 14 0" {...common} />
        </>
      );
    case "plus":
      return <path d="M12 5v14M5 12h14" {...common} />;
    case "dots":
      return (
        <>
          <circle cx="12" cy="5" r="1.4" fill="currentColor" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" />
          <circle cx="12" cy="19" r="1.4" fill="currentColor" />
        </>
      );
    case "play":
      return <path d="M8 6l10 6-10 6V6Z" {...common} />;
    case "upload":
      return (
        <>
          <path d="M12 16V4" {...common} />
          <path d="M7 9l5-5 5 5" {...common} />
          <path d="M4 20h16" {...common} />
        </>
      );
    case "document":
      return (
        <>
          <path d="M7 3h7l5 5v13H7V3Z" {...common} />
          <path d="M14 3v6h6" {...common} />
        </>
      );
    case "check":
      return <path d="M5 13l4 4L19 7" {...common} />;
    case "clock":
      return (
        <>
          <circle cx="12" cy="12" r="8" {...common} />
          <path d="M12 8v5l3 2" {...common} />
        </>
      );
    case "warning":
      return (
        <>
          <path d="M12 4l8 14H4L12 4Z" {...common} />
          <path d="M12 9v4" {...common} />
          <path d="M12 17h.01" {...common} />
        </>
      );
    case "edit":
      return (
        <>
          <path d="M4 20l4.5-1 9-9a2.1 2.1 0 0 0-3-3l-9 9L4 20Z" {...common} />
          <path d="M13.5 6.5l3 3" {...common} />
        </>
      );
    case "magic":
      return (
        <>
          <path d="M4 20l7-7" {...common} />
          <path d="M14 4l6 6" {...common} />
          <path d="M12 6l2-2" {...common} />
          <path d="M6 12l2-2" {...common} />
          <path d="M16 8l4-4" {...common} />
        </>
      );
    case "filter":
      return (
        <>
          <path d="M4 6h16" {...common} />
          <path d="M7 12h10" {...common} />
          <path d="M10 18h4" {...common} />
        </>
      );
    case "search":
      return (
        <>
          <circle cx="11" cy="11" r="6" {...common} />
          <path d="M20 20l-4.2-4.2" {...common} />
        </>
      );
    case "code":
      return (
        <>
          <path d="M8 8l-4 4 4 4" {...common} />
          <path d="M16 8l4 4-4 4" {...common} />
        </>
      );
    case "group":
      return (
        <>
          <circle cx="9" cy="9" r="3" {...common} />
          <circle cx="17" cy="10" r="2.5" {...common} />
          <path d="M4 20a5 5 0 0 1 10 0" {...common} />
          <path d="M14 20a4 4 0 0 1 6 0" {...common} />
        </>
      );
    case "refresh":
      return (
        <>
          <path d="M20 11a8 8 0 1 0 2 5" {...common} />
          <path d="M20 4v7h-7" {...common} />
        </>
      );
    case "wand":
      return (
        <>
          <path d="M4 20l11-11" {...common} />
          <path d="M14 4l1.2 3.2L18.5 8.5 15.3 9.7 14 13l-1.3-3.3L9.5 8.5l3.2-1.3L14 4Z" {...common} />
        </>
      );
    case "book":
      return (
        <>
          <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21V5.5Z" {...common} />
          <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19" {...common} />
        </>
      );
    case "lock":
      return (
        <>
          <rect x="6" y="11" width="12" height="9" rx="2" {...common} />
          <path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11" {...common} />
        </>
      );
    case "arrow":
      return <path d="M5 12h14M13 6l6 6-6 6" {...common} />;
    default:
      return <circle cx="12" cy="12" r="8" {...common} />;
  }
}
