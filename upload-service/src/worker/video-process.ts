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

const connection = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || "mypassword",
});

const worker = new Worker("videoProcess", handleUploadWorker, { connection });

async function handleUploadWorker(job: Job<VideoProcessJobData, void, string>): Promise<void> {
  try {
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
