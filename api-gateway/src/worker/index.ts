import { Job, Worker } from "bullmq";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { VIDEO_STATUS } from "../config/contrains";
import { db_connection } from "../config/db-config";
import { redisConnection } from "../config/queue-config";
import { video_table } from "../model/video.model";
import { formatDuration } from "../utils/format-duration";

export const videoProcessWorker = new Worker("video", workerCb, { connection: redisConnection });

const videoStatus = z.enum([
  VIDEO_STATUS.CORRUPTED,
  VIDEO_STATUS.PROCESSING,
  VIDEO_STATUS.TRANSCODING,
  VIDEO_STATUS.SUCCESS,
  VIDEO_STATUS.ERROR,
  VIDEO_STATUS.PUBLISHED,
]);
const payloadSchema = z.object({
  status: videoStatus,
  videoId: z.string(),
});

const metaSchema = z.object({
  duration: z.number(),
  thumbnail: z.string(),
  videoId: z.string(),
});

async function workerCb(job: Job) {
  // Check job, if job is - db-update then continue if job is meta-update then another logic
  if (job.name === "db-update") {
    await handleDbUpdate(job);
  } else if (job.name === "meta-update") {
    await updateMeta(job);
  }
}

async function handleDbUpdate(job: Job) {
  const parse = z.parse(payloadSchema, job.data);
  if (!parse) {
    throw new Error("Invalid job data");
  }

  const { status: jobStatus, videoId } = parse;

  const db = db_connection();
  await db.transaction(async (tx) => {
    await tx.update(video_table).set({ status: jobStatus }).where(eq(video_table.id, videoId));
  });
}

async function updateMeta(job: Job) {
  const parse = z.parse(metaSchema, job.data);
  if (!parse) {
    throw new Error("Invalid job data");
  }

  const { duration, thumbnail, videoId } = parse;

  const db = db_connection();
  await db.transaction(async (tx) => {
    await tx
      .update(video_table)
      .set({ duration: formatDuration(duration), thumbnail })
      .where(eq(video_table.id, videoId));
  });
}

videoProcessWorker.on("completed", (job) => {
  console.log(`Video job ${job.id} completed successfully`);
});

videoProcessWorker.on("failed", (job, err) => {
  console.error(`Video job ${job.id} failed with error: ${err.message}`);
});

videoProcessWorker.on("error", (error) => {
  console.error("Error occurred in video processing worker:", error);
});
