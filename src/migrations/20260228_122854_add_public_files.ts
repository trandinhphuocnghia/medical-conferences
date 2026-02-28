import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "public_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"key" varchar NOT NULL,
  	"filename" varchar NOT NULL,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"uploaded_by_id" integer,
  	"abstract_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "abstracts_rels" DROP CONSTRAINT "abstracts_rels_files_fk";
  
  DROP INDEX "abstracts_rels_files_id_idx";
  ALTER TABLE "abstracts" ALTER COLUMN "submitter_name" DROP NOT NULL;
  ALTER TABLE "abstracts" ALTER COLUMN "submitter_email" DROP NOT NULL;
  ALTER TABLE "abstracts_rels" ADD COLUMN "public_files_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "public_files_id" integer;
  ALTER TABLE "public_files" ADD CONSTRAINT "public_files_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "public_files" ADD CONSTRAINT "public_files_abstract_id_abstracts_id_fk" FOREIGN KEY ("abstract_id") REFERENCES "public"."abstracts"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "public_files_key_idx" ON "public_files" USING btree ("key");
  CREATE INDEX "public_files_uploaded_by_idx" ON "public_files" USING btree ("uploaded_by_id");
  CREATE INDEX "public_files_abstract_idx" ON "public_files" USING btree ("abstract_id");
  CREATE INDEX "public_files_updated_at_idx" ON "public_files" USING btree ("updated_at");
  CREATE INDEX "public_files_created_at_idx" ON "public_files" USING btree ("created_at");
  ALTER TABLE "abstracts_rels" ADD CONSTRAINT "abstracts_rels_public_files_fk" FOREIGN KEY ("public_files_id") REFERENCES "public"."public_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_public_files_fk" FOREIGN KEY ("public_files_id") REFERENCES "public"."public_files"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "abstracts_rels_public_files_id_idx" ON "abstracts_rels" USING btree ("public_files_id");
  CREATE INDEX "payload_locked_documents_rels_public_files_id_idx" ON "payload_locked_documents_rels" USING btree ("public_files_id");
  ALTER TABLE "abstracts_rels" DROP COLUMN "files_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "public_files" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "public_files" CASCADE;
  ALTER TABLE "abstracts_rels" RENAME COLUMN "public_files_id" TO "files_id";
  ALTER TABLE "abstracts_rels" DROP CONSTRAINT "abstracts_rels_public_files_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_public_files_fk";
  
  DROP INDEX "abstracts_rels_public_files_id_idx";
  DROP INDEX "payload_locked_documents_rels_public_files_id_idx";
  ALTER TABLE "abstracts" ALTER COLUMN "submitter_name" SET NOT NULL;
  ALTER TABLE "abstracts" ALTER COLUMN "submitter_email" SET NOT NULL;
  ALTER TABLE "abstracts_rels" ADD CONSTRAINT "abstracts_rels_files_fk" FOREIGN KEY ("files_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "abstracts_rels_files_id_idx" ON "abstracts_rels" USING btree ("files_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "public_files_id";`)
}
