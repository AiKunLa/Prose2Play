CREATE TABLE "adaptation_jobs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"work_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"tenant_id" uuid,
	"status" text NOT NULL,
	"target_format" text NOT NULL,
	"adaptation_mode" text NOT NULL,
	"target_duration_minutes" integer,
	"start_chapter" integer NOT NULL,
	"end_chapter" integer NOT NULL,
	"failed_from_status" text,
	"error_code" text,
	"error_message" text,
	"queued_at" timestamp with time zone,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "adaptation_jobs_status_check" CHECK ("adaptation_jobs"."status" in ('ingested', 'analyzed', 'planned', 'drafted', 'validated', 'edited', 'exported', 'failed')),
	CONSTRAINT "adaptation_jobs_end_gte_start_check" CHECK ("adaptation_jobs"."end_chapter" >= "adaptation_jobs"."start_chapter"),
	CONSTRAINT "adaptation_jobs_min_chapter_count_check" CHECK ("adaptation_jobs"."end_chapter" - "adaptation_jobs"."start_chapter" + 1 >= 3)
);
--> statement-breakpoint
CREATE TABLE "source_chapters" (
	"id" uuid PRIMARY KEY NOT NULL,
	"job_id" uuid NOT NULL,
	"chapter_number" integer NOT NULL,
	"chapter_title" text,
	"summary" text,
	"word_count" integer,
	"raw_text_object_key" text,
	"normalized_text_object_key" text,
	"content_hash" text,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "works" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"tenant_id" uuid,
	"title" text NOT NULL,
	"author_name" text,
	"source_language" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "adaptation_jobs" ADD CONSTRAINT "adaptation_jobs_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_chapters" ADD CONSTRAINT "source_chapters_job_id_adaptation_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."adaptation_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "adaptation_jobs_work_id_idx" ON "adaptation_jobs" USING btree ("work_id");--> statement-breakpoint
CREATE INDEX "adaptation_jobs_user_id_idx" ON "adaptation_jobs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "adaptation_jobs_tenant_id_idx" ON "adaptation_jobs" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "adaptation_jobs_status_idx" ON "adaptation_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "source_chapters_job_id_idx" ON "source_chapters" USING btree ("job_id");--> statement-breakpoint
CREATE UNIQUE INDEX "source_chapters_job_id_chapter_number_uidx" ON "source_chapters" USING btree ("job_id","chapter_number");--> statement-breakpoint
CREATE INDEX "works_user_id_idx" ON "works" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "works_tenant_id_idx" ON "works" USING btree ("tenant_id");