import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_abstracts_status" ADD VALUE 'draft';
  ALTER TYPE "public"."enum_abstracts_status" ADD VALUE 'pending';
  ALTER TYPE "public"."enum_abstracts_status" ADD VALUE 'accepted';
  ALTER TYPE "public"."enum_abstracts_status" ADD VALUE 'rejected';
  ALTER TYPE "public"."enum_abstracts_status" ADD VALUE 'verified';
  CREATE TABLE "users_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"topics_id" integer
  );
  

  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_rels_order_idx" ON "users_rels" USING btree ("order");
  CREATE INDEX "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
  CREATE INDEX "users_rels_path_idx" ON "users_rels" USING btree ("path");
  CREATE INDEX "users_rels_topics_id_idx" ON "users_rels" USING btree ("topics_id");
  CREATE INDEX "abstracts_status_idx" ON "abstracts" USING btree ("status");
  CREATE INDEX "users_role_idx" ON "users" USING btree ("role");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_rels" CASCADE;
  ALTER TABLE "abstracts" ALTER COLUMN "status" SET DATA TYPE text;
  DROP TYPE "public"."enum_abstracts_status";
  CREATE TYPE "public"."enum_abstracts_status" AS ENUM();
  ALTER TABLE "abstracts" ALTER COLUMN "status" SET DATA TYPE "public"."enum_abstracts_status" USING "status"::"public"."enum_abstracts_status";
  DROP INDEX "abstracts_status_idx";
  DROP INDEX "users_role_idx";
  ALTER TABLE "abstracts" ALTER COLUMN "status" DROP DEFAULT;`)
}
