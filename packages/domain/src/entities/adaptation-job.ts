import {
  AdaptationJobStatus,
  RecoverableAdaptationJobStatus,
  assertCanTransition,
  assertRetryTargetMatchesFailedStage,
} from "../state-machines/adaptation-job-state-machine.js";
import { ChapterRange, ChapterRangeInput, createChapterRange } from "../value-objects/chapter-range.js";
import { DomainValidationError } from "../errors/domain-error.js";

export interface AdaptationJobFailureInput {
  readonly code: string;
  readonly message: string;
  readonly failedFrom?: RecoverableAdaptationJobStatus;
}

export interface AdaptationJobFailure {
  readonly code: string;
  readonly message: string;
  readonly failedFrom: RecoverableAdaptationJobStatus;
}

export interface CreateAdaptationJobInput {
  readonly id: string;
  readonly workId: string;
  readonly chapterRange: ChapterRange | ChapterRangeInput;
  readonly createdAt?: string;
}

export interface TransitionAdaptationJobOptions {
  readonly at?: string;
  readonly failure?: AdaptationJobFailureInput;
}

export interface AdaptationJob {
  readonly id: string;
  readonly workId: string;
  readonly chapterRange: ChapterRange;
  readonly status: AdaptationJobStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly failure: AdaptationJobFailure | null;
}

function normalizeIdentifier(value: string, fieldName: string, code: string): string {
  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    throw new DomainValidationError(`The ${fieldName} must not be empty.`, code);
  }

  return normalizedValue;
}

function normalizeTimestamp(value: string | undefined, fieldName: string): string {
  const timestamp = value ?? new Date().toISOString();

  if (Number.isNaN(Date.parse(timestamp))) {
    throw new DomainValidationError(`The ${fieldName} must be a valid ISO timestamp.`, "ADAPTATION_JOB_TIMESTAMP_INVALID", {
      details: {
        fieldName,
        timestamp,
      },
    });
  }

  return timestamp;
}

function normalizeChapterRange(input: ChapterRange | ChapterRangeInput): ChapterRange {
  return createChapterRange({
    startChapter: input.startChapter,
    endChapter: input.endChapter,
  });
}

function createFailure(
  currentStatus: RecoverableAdaptationJobStatus,
  input: AdaptationJobFailureInput | undefined,
): AdaptationJobFailure {
  if (input === undefined) {
    throw new DomainValidationError(
      "A failure transition must include failure details for traceability.",
      "ADAPTATION_JOB_FAILURE_DETAILS_REQUIRED",
    );
  }

  const code = normalizeIdentifier(input.code, "failure code", "ADAPTATION_JOB_FAILURE_CODE_INVALID");
  const message = normalizeIdentifier(input.message, "failure message", "ADAPTATION_JOB_FAILURE_MESSAGE_INVALID");
  const failedFrom = input.failedFrom ?? currentStatus;

  if (failedFrom !== currentStatus) {
    throw new DomainValidationError(
      `The failedFrom stage must match the current status "${currentStatus}".`,
      "ADAPTATION_JOB_FAILURE_STAGE_MISMATCH",
      {
        details: {
          currentStatus,
          failedFrom,
        },
      },
    );
  }

  return Object.freeze({
    code,
    message,
    failedFrom,
  });
}

export function createAdaptationJob(input: CreateAdaptationJobInput): AdaptationJob {
  const id = normalizeIdentifier(input.id, "job id", "ADAPTATION_JOB_ID_INVALID");
  const workId = normalizeIdentifier(input.workId, "work id", "ADAPTATION_JOB_WORK_ID_INVALID");
  const chapterRange = normalizeChapterRange(input.chapterRange);
  const createdAt = normalizeTimestamp(input.createdAt, "createdAt");

  return Object.freeze({
    id,
    workId,
    chapterRange,
    status: "ingested",
    createdAt,
    updatedAt: createdAt,
    failure: null,
  });
}

export function transitionAdaptationJob(
  job: AdaptationJob,
  to: AdaptationJobStatus,
  options: TransitionAdaptationJobOptions = {},
): AdaptationJob {
  assertCanTransition(job.status, to);

  if (job.status === "failed") {
    if (job.failure === null) {
      throw new DomainValidationError(
        "A failed adaptation job must retain failure details before it can retry.",
        "ADAPTATION_JOB_FAILURE_DETAILS_MISSING",
      );
    }

    assertRetryTargetMatchesFailedStage(to, job.failure.failedFrom);
  }

  const updatedAt = normalizeTimestamp(options.at, "updatedAt");
  let failure: AdaptationJobFailure | null = null;

  if (to === "failed") {
    if (job.status === "exported" || job.status === "failed") {
      throw new DomainValidationError(
        `A job in "${job.status}" status cannot transition into failed.`,
        "ADAPTATION_JOB_FAILURE_TRANSITION_INVALID",
      );
    }

    failure = createFailure(job.status, options.failure);
  }

  return Object.freeze({
    ...job,
    status: to,
    updatedAt,
    failure,
  });
}
