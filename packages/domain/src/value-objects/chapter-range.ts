import { DomainValidationError } from "../errors/domain-error.js";

export const MIN_ADAPTATION_CHAPTER_COUNT = 3;

export interface ChapterRangeInput {
  readonly startChapter: number;
  readonly endChapter: number;
}

export interface ChapterRange {
  readonly startChapter: number;
  readonly endChapter: number;
  readonly chapterCount: number;
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

export function createChapterRange(input: ChapterRangeInput): ChapterRange {
  const { startChapter, endChapter } = input;

  if (!isPositiveInteger(startChapter)) {
    throw new DomainValidationError("The chapter range start must be a positive integer.", "CHAPTER_RANGE_START_INVALID", {
      details: { startChapter },
    });
  }

  if (!isPositiveInteger(endChapter)) {
    throw new DomainValidationError("The chapter range end must be a positive integer.", "CHAPTER_RANGE_END_INVALID", {
      details: { endChapter },
    });
  }

  if (endChapter < startChapter) {
    throw new DomainValidationError("The chapter range end must not be before the start.", "CHAPTER_RANGE_ORDER_INVALID", {
      details: {
        startChapter,
        endChapter,
      },
    });
  }

  const chapterCount = endChapter - startChapter + 1;

  if (chapterCount < MIN_ADAPTATION_CHAPTER_COUNT) {
    throw new DomainValidationError(
      `An adaptation job must cover at least ${MIN_ADAPTATION_CHAPTER_COUNT} chapters.`,
      "CHAPTER_RANGE_TOO_SMALL",
      {
        details: {
          startChapter,
          endChapter,
          chapterCount,
          minimumChapterCount: MIN_ADAPTATION_CHAPTER_COUNT,
        },
      },
    );
  }

  return Object.freeze({
    startChapter,
    endChapter,
    chapterCount,
  });
}
