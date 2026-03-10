import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_abstracts_presentation_language" AS ENUM('english', 'vietnamese');
  CREATE TYPE "public"."enum_users_source" AS ENUM('admin-created', 'registration');
  CREATE TYPE "public"."enum_users_registration_type" AS ENUM('invited', 'standard');
  ALTER TYPE "public"."enum_mail_logs_status" ADD VALUE 'dead-letter';
  ALTER TABLE "abstracts" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "abstracts" ALTER COLUMN "status" SET DEFAULT 'draft'::text;
  DROP TYPE "public"."enum_abstracts_status";
  CREATE TYPE "public"."enum_abstracts_status" AS ENUM('draft', 'pending', 'rejected', 'verified');
  ALTER TABLE "abstracts" ALTER COLUMN "status" SET DEFAULT 'draft'::"public"."enum_abstracts_status";
  ALTER TABLE "abstracts" ALTER COLUMN "status" SET DATA TYPE "public"."enum_abstracts_status" USING "status"::"public"."enum_abstracts_status";
  ALTER TABLE "abstracts" ALTER COLUMN "topic_id" DROP NOT NULL;
  ALTER TABLE "abstracts" ADD COLUMN "other_topic" varchar;
  ALTER TABLE "abstracts" ADD COLUMN "presentation_language" "enum_abstracts_presentation_language";
  ALTER TABLE "users" ADD COLUMN "source" "enum_users_source" DEFAULT 'admin-created' NOT NULL;
  ALTER TABLE "users" ADD COLUMN "registration_type" "enum_users_registration_type" DEFAULT 'standard';
  ALTER TABLE "users" ADD COLUMN "degrees" varchar;
  ALTER TABLE "users" ADD COLUMN "bio" jsonb;
  CREATE UNIQUE INDEX "users_email_1_idx" ON "users" USING btree ("email");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_abstracts_status" ADD VALUE 'accepted' BEFORE 'rejected';
  ALTER TABLE "mail_logs" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "mail_logs" ALTER COLUMN "status" SET DEFAULT 'pending'::text;
  DROP TYPE "public"."enum_mail_logs_status";
  CREATE TYPE "public"."enum_mail_logs_status" AS ENUM('pending', 'processing', 'sent', 'failed');
  ALTER TABLE "mail_logs" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."enum_mail_logs_status";
  ALTER TABLE "mail_logs" ALTER COLUMN "status" SET DATA TYPE "public"."enum_mail_logs_status" USING "status"::"public"."enum_mail_logs_status";
  DROP INDEX "users_email_1_idx";
  ALTER TABLE "abstracts" ALTER COLUMN "topic_id" SET NOT NULL;
  ALTER TABLE "abstracts" DROP COLUMN "other_topic";
  ALTER TABLE "abstracts" DROP COLUMN "presentation_language";
  ALTER TABLE "users" DROP COLUMN "source";
  ALTER TABLE "users" DROP COLUMN "registration_type";
  ALTER TABLE "users" DROP COLUMN "degrees";
  ALTER TABLE "users" DROP COLUMN "bio";
  DROP TYPE "public"."enum_abstracts_presentation_language";
  DROP TYPE "public"."enum_users_source";
  DROP TYPE "public"."enum_users_registration_type";`)
}
