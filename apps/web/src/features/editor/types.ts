export type Scene = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: "locked" | "draft";
};

export type AnalysisNote = {
  title: string;
  text: string;
};
