import { Job, Worker } from "bullmq";
import fs from "fs/promises";
import path from "path";
import { UPLOADS_BUCKET } from "../config/app-config";
import { renditions } from "../config/default-renditions";
import { downloadPath, transcodePath } from "../config/path-config";
import { video_status_queue } from "../config/queue-config";
import connection from "../config/redis-config";
import getDurationInSecond from "../service/duration-service";
import { downloadFile, uploadThumbnail, uploadTranscodedFiles } from "../service/storage-service";
import { makeHeroThumbnail } from "../service/thumbnail-service";
import { transcodeVideo } from "../service/transcode-service";
import logger from "../utils/logger";

interface TranscodeJobMeta {
  videoId: string;
  fileName: string;
  extension: string;
  totalChunks: number;
  recievedChunks: number;
}

interface TranscodeJobData {
  meta: TranscodeJobMeta;
}

type TranscodeJob = Job<TranscodeJobData>;

const transcodeWorker = new Worker<TranscodeJobData>(
  "transcodeQueue",
  async (job: TranscodeJob) => {
    const { meta } = job.data;
    const { videoId, fileName } = meta;
    const outputDir = path.join(transcodePath, videoId);
    let downloadedFilePath = "";

    logger.info(`Starting transcoding for videoId: ${videoId}, fileName: ${fileName}`);
    await video_status_queue.add("db-update", { videoId, status: "processing" });

    try {
      // Create output directory for transcoded files
      await fs.mkdir(outputDir, { recursive: true });

      // Download the file from minio
      downloadedFilePath = await downloadFile(UPLOADS_BUCKET, videoId, fileName);

      // Extract video duration and Make thumbnail
      const time = await getDurationInSecond(downloadedFilePath);
      const outputFileName = path.join(downloadPath, `${videoId}.webp`);
      await makeHeroThumbnail(downloadedFilePath, outputFileName, time);
      await uploadThumbnail(videoId, outputFileName);

      // Transcode the video using ffmpeg
      await video_status_queue.add("db-update", { videoId, status: "transcoding" });
      await transcodeVideo({
        videoId,
        inputPath: downloadedFilePath,
        outRootDir: outputDir,
        renditions: renditions,
        encrypt: true,
        keyUrlBase: `${process.env.STREAM_SERVICE_URL}/stream/hls`,
      });

      // Upload the transcoded files back to minio
      await uploadTranscodedFiles(videoId, outputDir);

      // notify to update db - api-gateway
      await video_status_queue.add("meta-update", {
        videoId,
        duration: time,
        thumbnail: `${videoId}/thumbnail.webp`,
        status: "published",
      });
    } catch (error) {
      // Log error and rethrow to let BullMQ handle job failure
      await video_status_queue.add("db-update", { videoId, status: "error" });
      logger.error("Transcoding error:" + error);
      throw error;
    } finally {
      // Clean up the output directory
      await fs.rm(outputDir, { recursive: true, force: true });
      await fs.rm(downloadedFilePath);
    }
  },
  { connection }
);

transcodeWorker.on("error", async (reason) => {
  logger.error(reason);
});
transcodeWorker.on("failed", (job, err) => logger.error(`Transcoding job failed: ${job.id} ${err}`));
transcodeWorker.on("active", (job) => logger.info(`Transcoding job active: ${job.id}`));

export default transcodeWorker;
