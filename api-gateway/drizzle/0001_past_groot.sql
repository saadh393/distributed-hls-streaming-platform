ALTER TABLE "video" ALTER COLUMN "thumbnail" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "video" ADD COLUMN "duration" varchar(10);