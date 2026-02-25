import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Only add the new abstract body + anonymous submitter columns.
  // mail_logs table was already created in a previous migration.
  await db.execute(sql`
    ALTER TABLE "abstracts" ADD COLUMN IF NOT EXISTS "submitter_name" varchar;
    ALTER TABLE "abstracts" ADD COLUMN IF NOT EXISTS "submitter_email" varchar;
    ALTER TABLE "abstracts" ADD COLUMN IF NOT EXISTS "submitter_organization" varchar;
    ALTER TABLE "abstracts" ADD COLUMN IF NOT EXISTS "name_of_study" varchar;
    ALTER TABLE "abstracts" ADD COLUMN IF NOT EXISTS "aim" varchar;
    ALTER TABLE "abstracts" ADD COLUMN IF NOT EXISTS "methods" varchar;
    ALTER TABLE "abstracts" ADD COLUMN IF NOT EXISTS "results" varchar;
    ALTER TABLE "abstracts" ADD COLUMN IF NOT EXISTS "conclusion" varchar;
    ALTER TABLE "abstracts" DROP COLUMN IF EXISTS "description";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "abstracts" ADD COLUMN IF NOT EXISTS "description" jsonb;
    ALTER TABLE "abstracts" DROP COLUMN IF EXISTS "submitter_name";
    ALTER TABLE "abstracts" DROP COLUMN IF EXISTS "submitter_email";
    ALTER TABLE "abstracts" DROP COLUMN IF EXISTS "submitter_organization";
    ALTER TABLE "abstracts" DROP COLUMN IF EXISTS "name_of_study";
    ALTER TABLE "abstracts" DROP COLUMN IF EXISTS "aim";
    ALTER TABLE "abstracts" DROP COLUMN IF EXISTS "methods";
    ALTER TABLE "abstracts" DROP COLUMN IF EXISTS "results";
    ALTER TABLE "abstracts" DROP COLUMN IF EXISTS "conclusion";
  `)
}
