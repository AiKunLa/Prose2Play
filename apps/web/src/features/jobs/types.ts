export type UploadChapter = {
  name: string;
  size: string;
  status: string;
};

export type PipelineStage = {
  label: string;
  done: boolean;
  active?: boolean;
};

export type RoleCard = {
  title: string;
  text: string;
};

export type SliderMetric = {
  title: string;
  description: string;
  value: number;
};

export type JobMetric = {
  label: string;
  value: string;
  description: string;
};
