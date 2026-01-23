import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "topics_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  ALTER TABLE "topics" DROP CONSTRAINT "topics_conference_id_posts_id_fk";
  
  DROP INDEX "topics_conference_idx";
  ALTER TABLE "topics_rels" ADD CONSTRAINT "topics_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "topics_rels" ADD CONSTRAINT "topics_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "topics_rels_order_idx" ON "topics_rels" USING btree ("order");
  CREATE INDEX "topics_rels_parent_idx" ON "topics_rels" USING btree ("parent_id");
  CREATE INDEX "topics_rels_path_idx" ON "topics_rels" USING btree ("path");
  CREATE INDEX "topics_rels_posts_id_idx" ON "topics_rels" USING btree ("posts_id");
  ALTER TABLE "topics" DROP COLUMN "conference_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "topics_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "topics_rels" CASCADE;
  ALTER TABLE "topics" ADD COLUMN "conference_id" integer;
  ALTER TABLE "topics" ADD CONSTRAINT "topics_conference_id_posts_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "topics_conference_idx" ON "topics" USING btree ("conference_id");`)
}
