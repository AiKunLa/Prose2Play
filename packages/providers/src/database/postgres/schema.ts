import { check, index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const ADAPTATION_JOB_STATUS_VALUES = [
  "ingested",
  "analyzed",
  "planned",
  "drafted",
  "validated",
  "edited",
  "exported",
  "failed",
] as const;

export const works = pgTable(
  "works",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id").notNull(),
    tenantId: uuid("tenant_id"),
    title: text("title").notNull(),
    authorName: text("author_name"),
    sourceLanguage: text("source_language").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    index("works_user_id_idx").on(table.userId),
    index("works_tenant_id_idx").on(table.tenantId),
  ],
);

export const adaptationJobs = pgTable(
  "adaptation_jobs",
  {
    id: uuid("id").primaryKey(),
    workId: uuid("work_id")
      .notNull()
      .references(() => works.id, { onDelete: "restrict" }),
    userId: uuid("user_id").notNull(),
    tenantId: uuid("tenant_id"),
    status: text("status").notNull(),
    targetFormat: text("target_format").notNull(),
    adaptationMode: text("adaptation_mode").notNull(),
    targetDurationMinutes: integer("target_duration_minutes"),
    startChapter: integer("start_chapter").notNull(),
    endChapter: integer("end_chapter").notNull(),
    failedFromStatus: text("failed_from_status"),
    errorCode: text("error_code"),
    errorMessage: text("error_message"),
    queuedAt: timestamp("queued_at", { withTimezone: true, mode: "date" }),
    startedAt: timestamp("started_at", { withTimezone: true, mode: "date" }),
    completedAt: timestamp("completed_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [
    index("adaptation_jobs_work_id_idx").on(table.workId),
    index("adaptation_jobs_user_id_idx").on(table.userId),
    index("adaptation_jobs_tenant_id_idx").on(table.tenantId),
    index("adaptation_jobs_status_idx").on(table.status),
    check(
      "adaptation_jobs_status_check",
      sql`${table.status} in (${sql.raw(ADAPTATION_JOB_STATUS_VALUES.map((value) => `'${value}'`).join(", "))})`,
    ),
    check("adaptation_jobs_end_gte_start_check", sql`${table.endChapter} >= ${table.startChapter}`),
    check(
      "adaptation_jobs_min_chapter_count_check",
      sql`${table.endChapter} - ${table.startChapter} + 1 >= 3`,
    ),
  ],
);

export const sourceChapters = pgTable(
  "source_chapters",
  {
    id: uuid("id").primaryKey(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => adaptationJobs.id, { onDelete: "cascade" }),
    chapterNumber: integer("chapter_number").notNull(),
    chapterTitle: text("chapter_title"),
    summary: text("summary"),
    wordCount: integer("word_count"),
    rawTextObjectKey: text("raw_text_object_key"),
    normalizedTextObjectKey: text("normalized_text_object_key"),
    contentHash: text("content_hash"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  },
  (table) => [
    index("source_chapters_job_id_idx").on(table.jobId),
    uniqueIndex("source_chapters_job_id_chapter_number_uidx").on(table.jobId, table.chapterNumber),
  ],
);
