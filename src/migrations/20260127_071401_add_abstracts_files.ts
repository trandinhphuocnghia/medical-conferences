import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "abstracts_rels" DROP CONSTRAINT "abstracts_rels_media_fk";
  
  DROP INDEX "abstracts_rels_media_id_idx";
  ALTER TABLE "abstracts_rels" ADD COLUMN "files_id" integer;
  ALTER TABLE "abstracts_rels" ADD CONSTRAINT "abstracts_rels_files_fk" FOREIGN KEY ("files_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "abstracts_rels_files_id_idx" ON "abstracts_rels" USING btree ("files_id");
  ALTER TABLE "abstracts_rels" DROP COLUMN "media_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "abstracts_rels" RENAME COLUMN "files_id" TO "media_id";
  ALTER TABLE "abstracts_rels" DROP CONSTRAINT "abstracts_rels_files_fk";
  
  DROP INDEX "abstracts_rels_files_id_idx";
  ALTER TABLE "abstracts_rels" ADD CONSTRAINT "abstracts_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "abstracts_rels_media_id_idx" ON "abstracts_rels" USING btree ("media_id");`)
}
