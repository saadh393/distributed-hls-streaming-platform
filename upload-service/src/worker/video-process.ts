import { Job, Worker } from "bullmq";
import fs from "fs";
import IORedis from "ioredis";
import minio, { BUCKET } from "../config/minio";
import checkPathExists from "../utils/check-file-exists";

interface VideoProcessJobData {
  videoId: string;
  meta: Record<string, unknown>;
  completePath: string;
}

const connectionConfig: any = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
};

const connection = new IORedis(connectionConfig);

// Add connection event listeners for debugging
connection.on("connect", () => {
  console.log("Redis connected successfully");
});

connection.on("error", (err) => {
  console.error("Redis connection error:", err);
});

connection.on("ready", () => {
  console.log("Redis is ready");
});

export function startWorker() {
  console.log(process.env.REDIS_HOST, process.env.REDIS_PORT, process.env.REDIS_PASSWORD);

  try {
    const worker = new Worker("videoQueue", handleUploadWorker, { connection });

    worker.on("error", (e) => console.log("Worker error:", e));
    worker.on("completed", (job) => console.log(`Job ${job.id} completed successfully`));
    worker.on("failed", (job, err) => console.log(`Job ${job?.id} failed with error: ${err.message}`));

    console.log("Video processing worker started");
    return worker;
  } catch (error) {
    console.error("Error starting worker:", error);
    throw error;
  }
}

async function handleUploadWorker(job: Job<VideoProcessJobData, void, string>): Promise<void> {
  try {
    console.log("Worker just Started");
    const { videoId, meta, completePath } = job.data;

    const isValidCompletePath: boolean = await checkPathExists(completePath);
    if (!isValidCompletePath) {
      throw new Error("The Complete Path is Invalid, we found " + completePath);
    }

    const fileStream: fs.ReadStream = fs.createReadStream(completePath);
    await minio.putObject(BUCKET, videoId, fileStream);

    // Remove the file
    fs.unlink(completePath, () => {
      console.log(completePath, "Deleted");
    });
  } catch (error) {
    throw error;
  }
}
