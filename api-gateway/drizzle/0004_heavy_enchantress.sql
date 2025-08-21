ALTER TABLE "video" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "video" ALTER COLUMN "status" SET DEFAULT 'uploading'::text;--> statement-breakpoint
DROP TYPE "public"."status";--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('uploading', 'processing', 'transcoding', 'success', 'published', 'corrupted');--> statement-breakpoint
ALTER TABLE "video" ALTER COLUMN "status" SET DEFAULT 'uploading'::"public"."status";--> statement-breakpoint
ALTER TABLE "video" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";--> statement-breakpoint
ALTER TABLE "video" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "video" ADD COLUMN "description" varchar(255);