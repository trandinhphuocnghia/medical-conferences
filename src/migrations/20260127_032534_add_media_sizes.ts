import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "sizes_thumbnail__key" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_preview__key" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_preview_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_preview_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_preview_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_preview_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_preview_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_preview_filename" varchar;
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_preview_sizes_preview_filename_idx" ON "media" USING btree ("sizes_preview_filename");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx";
  DROP INDEX "media_sizes_preview_sizes_preview_filename_idx";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail__key";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_url";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_width";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_height";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_preview__key";
  ALTER TABLE "media" DROP COLUMN "sizes_preview_url";
  ALTER TABLE "media" DROP COLUMN "sizes_preview_width";
  ALTER TABLE "media" DROP COLUMN "sizes_preview_height";
  ALTER TABLE "media" DROP COLUMN "sizes_preview_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_preview_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_preview_filename";`)
}
