import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "enum_users_roles" AS ENUM('admin', 'faculty', 'student');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_fees_payment_status" AS ENUM('paid', 'unpaid', 'delayed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"roles" "enum_users_roles" NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"reset_password_token" varchar,
	"reset_password_expiration" timestamp(3) with time zone,
	"salt" varchar,
	"hash" varchar,
	"login_attempts" numeric,
	"lock_until" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"content" jsonb NOT NULL,
	"content_html" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "attendances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp(3) with time zone NOT NULL,
	"is_present" boolean NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "attendances_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" uuid NOT NULL,
	"path" varchar NOT NULL,
	"courses_id" uuid,
	"students_id" uuid
);

CREATE TABLE IF NOT EXISTS "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name" varchar NOT NULL,
	"credits" numeric NOT NULL,
	"duration" numeric NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "courses_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" uuid NOT NULL,
	"path" varchar NOT NULL,
	"subjects_id" uuid
);

CREATE TABLE IF NOT EXISTS "faculties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"faculty_id" numeric NOT NULL,
	"number" numeric NOT NULL,
	"dob" timestamp(3) with time zone NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "faculties_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" uuid NOT NULL,
	"path" varchar NOT NULL,
	"users_id" uuid,
	"courses_id" uuid,
	"subjects_id" uuid,
	"media_id" uuid
);

CREATE TABLE IF NOT EXISTS "fees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" varchar NOT NULL,
	"amount" numeric NOT NULL,
	"due_date" timestamp(3) with time zone NOT NULL,
	"paymentStatus" "enum_fees_payment_status" NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "fees_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" uuid NOT NULL,
	"path" varchar NOT NULL,
	"students_id" uuid
);

CREATE TABLE IF NOT EXISTS "grades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_type" varchar NOT NULL,
	"marks" numeric NOT NULL,
	"max_marks" numeric NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "grades_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" uuid NOT NULL,
	"path" varchar NOT NULL,
	"students_id" uuid,
	"courses_id" uuid
);

CREATE TABLE IF NOT EXISTS "progresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"percent" numeric NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "progresses_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" uuid NOT NULL,
	"path" varchar NOT NULL,
	"subjects_id" uuid,
	"students_id" uuid
);

CREATE TABLE IF NOT EXISTS "students_links" (
	"_order" integer NOT NULL,
	"_parent_id" uuid NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar,
	"url" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" numeric NOT NULL,
	"number" numeric NOT NULL,
	"dob" timestamp(3) with time zone NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "students_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" uuid NOT NULL,
	"path" varchar NOT NULL,
	"users_id" uuid,
	"courses_id" uuid,
	"media_id" uuid
);

CREATE TABLE IF NOT EXISTS "subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alt" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric,
	"focal_x" numeric,
	"focal_y" numeric,
	"sizes_thumbnail_url" varchar,
	"sizes_thumbnail_width" numeric,
	"sizes_thumbnail_height" numeric,
	"sizes_thumbnail_mime_type" varchar,
	"sizes_thumbnail_filesize" numeric,
	"sizes_thumbnail_filename" varchar
);

CREATE TABLE IF NOT EXISTS "payload_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar,
	"value" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" uuid NOT NULL,
	"path" varchar NOT NULL,
	"users_id" uuid
);

CREATE TABLE IF NOT EXISTS "payload_migrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"batch" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "metadata_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" uuid NOT NULL,
	"path" varchar NOT NULL,
	"media_id" uuid
);

CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "announcements_created_at_idx" ON "announcements" ("created_at");
CREATE INDEX IF NOT EXISTS "attendances_created_at_idx" ON "attendances" ("created_at");
CREATE INDEX IF NOT EXISTS "attendances_rels_order_idx" ON "attendances_rels" ("order");
CREATE INDEX IF NOT EXISTS "attendances_rels_parent_idx" ON "attendances_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "attendances_rels_path_idx" ON "attendances_rels" ("path");
CREATE UNIQUE INDEX IF NOT EXISTS "courses_code_idx" ON "courses" ("code");
CREATE INDEX IF NOT EXISTS "courses_created_at_idx" ON "courses" ("created_at");
CREATE INDEX IF NOT EXISTS "courses_rels_order_idx" ON "courses_rels" ("order");
CREATE INDEX IF NOT EXISTS "courses_rels_parent_idx" ON "courses_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "courses_rels_path_idx" ON "courses_rels" ("path");
CREATE UNIQUE INDEX IF NOT EXISTS "faculties_faculty_id_idx" ON "faculties" ("faculty_id");
CREATE INDEX IF NOT EXISTS "faculties_created_at_idx" ON "faculties" ("created_at");
CREATE INDEX IF NOT EXISTS "faculties_rels_order_idx" ON "faculties_rels" ("order");
CREATE INDEX IF NOT EXISTS "faculties_rels_parent_idx" ON "faculties_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "faculties_rels_path_idx" ON "faculties_rels" ("path");
CREATE INDEX IF NOT EXISTS "fees_created_at_idx" ON "fees" ("created_at");
CREATE INDEX IF NOT EXISTS "fees_rels_order_idx" ON "fees_rels" ("order");
CREATE INDEX IF NOT EXISTS "fees_rels_parent_idx" ON "fees_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "fees_rels_path_idx" ON "fees_rels" ("path");
CREATE INDEX IF NOT EXISTS "grades_created_at_idx" ON "grades" ("created_at");
CREATE INDEX IF NOT EXISTS "grades_rels_order_idx" ON "grades_rels" ("order");
CREATE INDEX IF NOT EXISTS "grades_rels_parent_idx" ON "grades_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "grades_rels_path_idx" ON "grades_rels" ("path");
CREATE INDEX IF NOT EXISTS "progresses_created_at_idx" ON "progresses" ("created_at");
CREATE INDEX IF NOT EXISTS "progresses_rels_order_idx" ON "progresses_rels" ("order");
CREATE INDEX IF NOT EXISTS "progresses_rels_parent_idx" ON "progresses_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "progresses_rels_path_idx" ON "progresses_rels" ("path");
CREATE INDEX IF NOT EXISTS "students_links_order_idx" ON "students_links" ("_order");
CREATE INDEX IF NOT EXISTS "students_links_parent_id_idx" ON "students_links" ("_parent_id");
CREATE UNIQUE INDEX IF NOT EXISTS "students_student_id_idx" ON "students" ("student_id");
CREATE INDEX IF NOT EXISTS "students_created_at_idx" ON "students" ("created_at");
CREATE INDEX IF NOT EXISTS "students_rels_order_idx" ON "students_rels" ("order");
CREATE INDEX IF NOT EXISTS "students_rels_parent_idx" ON "students_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "students_rels_path_idx" ON "students_rels" ("path");
CREATE UNIQUE INDEX IF NOT EXISTS "subjects_code_idx" ON "subjects" ("code");
CREATE INDEX IF NOT EXISTS "subjects_created_at_idx" ON "subjects" ("created_at");
CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" ("filename");
CREATE INDEX IF NOT EXISTS "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" ("sizes_thumbnail_filename");
CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" ("key");
CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" ("created_at");
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" ("order");
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" ("path");
CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" ("created_at");
CREATE INDEX IF NOT EXISTS "metadata_rels_order_idx" ON "metadata_rels" ("order");
CREATE INDEX IF NOT EXISTS "metadata_rels_parent_idx" ON "metadata_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "metadata_rels_path_idx" ON "metadata_rels" ("path");
DO $$ BEGIN
 ALTER TABLE "attendances_rels" ADD CONSTRAINT "attendances_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "attendances"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "attendances_rels" ADD CONSTRAINT "attendances_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "attendances_rels" ADD CONSTRAINT "attendances_rels_students_fk" FOREIGN KEY ("students_id") REFERENCES "students"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_subjects_fk" FOREIGN KEY ("subjects_id") REFERENCES "subjects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "faculties_rels" ADD CONSTRAINT "faculties_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "faculties"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "faculties_rels" ADD CONSTRAINT "faculties_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "faculties_rels" ADD CONSTRAINT "faculties_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "faculties_rels" ADD CONSTRAINT "faculties_rels_subjects_fk" FOREIGN KEY ("subjects_id") REFERENCES "subjects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "faculties_rels" ADD CONSTRAINT "faculties_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "fees_rels" ADD CONSTRAINT "fees_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "fees"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "fees_rels" ADD CONSTRAINT "fees_rels_students_fk" FOREIGN KEY ("students_id") REFERENCES "students"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grades_rels" ADD CONSTRAINT "grades_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "grades"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grades_rels" ADD CONSTRAINT "grades_rels_students_fk" FOREIGN KEY ("students_id") REFERENCES "students"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "grades_rels" ADD CONSTRAINT "grades_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "progresses_rels" ADD CONSTRAINT "progresses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "progresses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "progresses_rels" ADD CONSTRAINT "progresses_rels_subjects_fk" FOREIGN KEY ("subjects_id") REFERENCES "subjects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "progresses_rels" ADD CONSTRAINT "progresses_rels_students_fk" FOREIGN KEY ("students_id") REFERENCES "students"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "students_links" ADD CONSTRAINT "students_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "students"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "students_rels" ADD CONSTRAINT "students_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "students"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "students_rels" ADD CONSTRAINT "students_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "students_rels" ADD CONSTRAINT "students_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "students_rels" ADD CONSTRAINT "students_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "metadata_rels" ADD CONSTRAINT "metadata_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "metadata"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "metadata_rels" ADD CONSTRAINT "metadata_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP TABLE "users";
DROP TABLE "announcements";
DROP TABLE "attendances";
DROP TABLE "attendances_rels";
DROP TABLE "courses";
DROP TABLE "courses_rels";
DROP TABLE "faculties";
DROP TABLE "faculties_rels";
DROP TABLE "fees";
DROP TABLE "fees_rels";
DROP TABLE "grades";
DROP TABLE "grades_rels";
DROP TABLE "progresses";
DROP TABLE "progresses_rels";
DROP TABLE "students_links";
DROP TABLE "students";
DROP TABLE "students_rels";
DROP TABLE "subjects";
DROP TABLE "media";
DROP TABLE "payload_preferences";
DROP TABLE "payload_preferences_rels";
DROP TABLE "payload_migrations";
DROP TABLE "metadata";
DROP TABLE "metadata_rels";`);

};
