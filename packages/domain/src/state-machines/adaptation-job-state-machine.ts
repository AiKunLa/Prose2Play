import { AdaptationJobTransitionError, DomainValidationError } from "../errors/domain-error.js";

export const ADAPTATION_JOB_STATUSES = [
  "ingested",
  "analyzed",
  "planned",
  "drafted",
  "validated",
  "edited",
  "exported",
  "failed",
] as const;

export type AdaptationJobStatus = (typeof ADAPTATION_JOB_STATUSES)[number];

export type RecoverableAdaptationJobStatus = Exclude<AdaptationJobStatus, "exported" | "failed">;

const RECOVERABLE_STATUSES: readonly RecoverableAdaptationJobStatus[] = [
  "ingested",
  "analyzed",
  "planned",
  "drafted",
  "validated",
  "edited",
];

const ALLOWED_TRANSITIONS: Readonly<Record<AdaptationJobStatus, readonly AdaptationJobStatus[]>> = Object.freeze({
  ingested: ["analyzed", "failed"],
  analyzed: ["planned", "failed"],
  planned: ["drafted", "failed"],
  drafted: ["validated", "failed"],
  validated: ["edited", "exported", "failed"],
  edited: ["validated", "exported", "failed"],
  exported: [],
  failed: RECOVERABLE_STATUSES,
});

export function isAdaptationJobStatus(value: string): value is AdaptationJobStatus {
  return ADAPTATION_JOB_STATUSES.includes(value as AdaptationJobStatus);
}

export function isRecoverableAdaptationJobStatus(value: string): value is RecoverableAdaptationJobStatus {
  return RECOVERABLE_STATUSES.includes(value as RecoverableAdaptationJobStatus);
}

export function getAllowedTransitions(status: AdaptationJobStatus): readonly AdaptationJobStatus[] {
  return ALLOWED_TRANSITIONS[status];
}

export function canTransition(from: AdaptationJobStatus, to: AdaptationJobStatus): boolean {
  return getAllowedTransitions(from).includes(to);
}

export function assertCanTransition(from: AdaptationJobStatus, to: AdaptationJobStatus): void {
  if (!canTransition(from, to)) {
    throw new AdaptationJobTransitionError(from, to);
  }
}

export function assertRetryTargetMatchesFailedStage(
  targetStatus: AdaptationJobStatus,
  failedFrom: RecoverableAdaptationJobStatus,
): void {
  if (targetStatus !== failedFrom) {
    throw new DomainValidationError(
      `A failed adaptation job can only retry from its failed stage "${failedFrom}".`,
      "ADAPTATION_JOB_RETRY_TARGET_MISMATCH",
      {
        details: {
          targetStatus,
          failedFrom,
        },
      },
    );
  }
}
