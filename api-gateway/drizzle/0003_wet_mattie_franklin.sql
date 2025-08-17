CREATE TYPE "public"."status" AS ENUM('pending', 'published', 'corrupted');--> statement-breakpoint
ALTER TABLE "video" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "video" ADD COLUMN "status" "status" DEFAULT 'pending';