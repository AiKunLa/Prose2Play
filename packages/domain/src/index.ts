export {
  AdaptationJobTransitionError,
  DomainError,
  DomainValidationError,
} from "./errors/domain-error.js";
export {
  type AdaptationJob,
  type AdaptationJobFailure,
  type AdaptationJobFailureInput,
  type CreateAdaptationJobInput,
  type TransitionAdaptationJobOptions,
  createAdaptationJob,
  transitionAdaptationJob,
} from "./entities/adaptation-job.js";
export {
  ADAPTATION_JOB_STATUSES,
  type AdaptationJobStatus,
  type RecoverableAdaptationJobStatus,
  assertCanTransition,
  canTransition,
  getAllowedTransitions,
  isAdaptationJobStatus,
  isRecoverableAdaptationJobStatus,
} from "./state-machines/adaptation-job-state-machine.js";
export {
  MIN_ADAPTATION_CHAPTER_COUNT,
  type ChapterRange,
  type ChapterRangeInput,
  createChapterRange,
} from "./value-objects/chapter-range.js";
