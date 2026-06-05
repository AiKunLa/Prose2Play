import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { createRequire } from "node:module";

const root = process.cwd();
const require = createRequire(import.meta.url);
const compiledEntryPath = path.join(root, "dist", "index.js");
const tsBuildInfoPath = path.join(root, "tsconfig.tsbuildinfo");

function compileDomainPackage() {
  if (existsSync(tsBuildInfoPath)) {
    rmSync(tsBuildInfoPath);
  }

  const tscEntrypoint = path.join(root, "node_modules", "typescript", "bin", "tsc");

  execFileSync(process.execPath, [tscEntrypoint, "-p", "packages/domain/tsconfig.json"], {
    cwd: root,
    stdio: "pipe",
  });
}

function loadDomainModule() {
  compileDomainPackage();

  return require(compiledEntryPath);
}

const domain = loadDomainModule();

function createJobFixture() {
  return domain.createAdaptationJob({
    id: "job-001",
    workId: "novel-001",
    chapterRange: {
      startChapter: 1,
      endChapter: 3,
    },
    createdAt: "2026-06-05T00:00:00.000Z",
  });
}

test("creates a valid adaptation job with an ingested initial status", () => {
  const job = createJobFixture();

  assert.equal(job.status, "ingested");
  assert.equal(job.id, "job-001");
  assert.equal(job.workId, "novel-001");
  assert.deepEqual(job.chapterRange, {
    startChapter: 1,
    endChapter: 3,
    chapterCount: 3,
  });
  assert.equal(job.failure, null);
});

test("rejects chapter ranges with fewer than three chapters", () => {
  assert.throws(
    () =>
      domain.createChapterRange({
        startChapter: 5,
        endChapter: 6,
      }),
    (error) => {
      assert.equal(error.name, "DomainValidationError");
      assert.equal(error.code, "CHAPTER_RANGE_TOO_SMALL");

      return true;
    },
  );
});

test("reports legal and illegal state transitions", () => {
  assert.equal(domain.canTransition("ingested", "analyzed"), true);
  assert.equal(domain.canTransition("validated", "exported"), true);
  assert.equal(domain.canTransition("ingested", "drafted"), false);
  assert.equal(domain.canTransition("exported", "edited"), false);
});

test("applies legal adaptation job transitions immutably", () => {
  const ingestedJob = createJobFixture();
  const analyzedJob = domain.transitionAdaptationJob(ingestedJob, "analyzed", {
    at: "2026-06-05T01:00:00.000Z",
  });
  const plannedJob = domain.transitionAdaptationJob(analyzedJob, "planned", {
    at: "2026-06-05T02:00:00.000Z",
  });
  const draftedJob = domain.transitionAdaptationJob(plannedJob, "drafted", {
    at: "2026-06-05T03:00:00.000Z",
  });
  const validatedJob = domain.transitionAdaptationJob(draftedJob, "validated", {
    at: "2026-06-05T04:00:00.000Z",
  });
  const editedJob = domain.transitionAdaptationJob(validatedJob, "edited", {
    at: "2026-06-05T05:00:00.000Z",
  });
  const exportedJob = domain.transitionAdaptationJob(editedJob, "exported", {
    at: "2026-06-05T06:00:00.000Z",
  });

  assert.notEqual(analyzedJob, ingestedJob);
  assert.equal(ingestedJob.status, "ingested");
  assert.equal(exportedJob.status, "exported");
  assert.equal(exportedJob.updatedAt, "2026-06-05T06:00:00.000Z");
  assert.equal(exportedJob.failure, null);
});

test("rejects illegal adaptation job transitions", () => {
  const job = createJobFixture();

  assert.throws(
    () =>
      domain.transitionAdaptationJob(job, "drafted", {
        at: "2026-06-05T03:00:00.000Z",
      }),
    (error) => {
      assert.equal(error.name, "AdaptationJobTransitionError");
      assert.equal(error.code, "ADAPTATION_JOB_TRANSITION_NOT_ALLOWED");

      return true;
    },
  );
});

test("supports failing a job and retrying from the failed stage", () => {
  const job = createJobFixture();
  const analyzedJob = domain.transitionAdaptationJob(job, "analyzed", {
    at: "2026-06-05T01:00:00.000Z",
  });
  const failedJob = domain.transitionAdaptationJob(analyzedJob, "failed", {
    at: "2026-06-05T01:30:00.000Z",
    failure: {
      code: "MODEL_TIMEOUT",
      message: "analysis step timed out",
      failedFrom: "analyzed",
    },
  });
  const retriedJob = domain.transitionAdaptationJob(failedJob, "analyzed", {
    at: "2026-06-05T02:00:00.000Z",
  });

  assert.equal(failedJob.status, "failed");
  assert.deepEqual(failedJob.failure, {
    code: "MODEL_TIMEOUT",
    message: "analysis step timed out",
    failedFrom: "analyzed",
  });
  assert.equal(retriedJob.status, "analyzed");
  assert.equal(retriedJob.failure, null);
});
