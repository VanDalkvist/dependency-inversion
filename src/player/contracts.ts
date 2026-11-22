export type StageNode = {
  id: string;
  label: string;
  subtitle: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  kind: "policy" | "contract" | "detail" | "artifact";
  icon?: string;
  body?: string[];
  lines?: string[];
  linesLabel?: string;
  focus?: boolean;
  action?: { id: string; label: string; selected?: boolean };
  hint?: string;
  inspectLabel?: string;
  content?: { title: string; text: string };
  appearAfter?: number;
  detail?: string;
  code?: { file: string; text: string };
};
export type StageEdge = {
  id: string;
  from: string;
  to: string;
  label?: string;
  emphasis?: boolean;
};
export type StageRegion = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};
export type StageView = {
  explicitControls?: boolean;
  flow?: boolean;
  nodes: StageNode[];
  edges: StageEdge[];
  regions?: StageRegion[];
  note?: string;
};
export type StoryContext = {
  answers: Record<string, string>;
  results: Record<string, unknown>;
  attempt: string | null;
  configuration: Record<string, string>;
};
export type StoryAction = {
  id: string;
  label: string;
  feedback: string;
  correct?: boolean;
  perform?: (context: StoryContext) => Record<string, unknown>;
};
export type StoryScene = {
  id: string;
  chapter: string;
  title: string;
  body: string;
  caption: string;
  duration: number;
  views: Record<string, StageView>;
  resolvedViews?: Record<string, StageView>;
  gate?: boolean;
  actions?: StoryAction[];
  experiment?: boolean;
  insight?: string;
  revealOnAction?: boolean;
  experimentDefaults?: Record<string, string>;
  project?: (
    context: StoryContext,
  ) => Partial<
    Pick<
      StoryScene,
      "views" | "actions" | "body" | "caption" | "experimentDefaults"
    >
  >;
};
export type ExperimentResult = {
  summary: string;
  facts: { label: string; value: string }[];
  artifacts: { title: string; format: string; body: string }[];
  trace: string[];
};
export type ExperimentDefinition = {
  title: string;
  description: string;
  runLabel?: string;
  choices: {
    id: string;
    label: string;
    options: { id: string; label: string }[];
  }[];
  run: (configuration: Record<string, string>) => ExperimentResult;
};
export type LessonLink = {
  href: string;
  label: string;
  title: string;
  current?: boolean;
};
export type StoryDefinition = {
  id: string;
  title: string;
  subtitle: string;
  hook?: string;
  /** Short, author-curated path for non-technical readers. Full scenes stay in expert mode. */
  guidedScenes?: readonly string[];
  purpose?: string;
  topic?: string;
  conclusion?: { title: string; body: string };
  viewLabels?: Record<string, string>;
  chapters: { id: string; title: string }[];
  scenes: StoryScene[];
  experiment?: ExperimentDefinition;
  sources?: { title: string; url: string }[];
};
