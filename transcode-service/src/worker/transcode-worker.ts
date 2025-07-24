import { Job, Worker } from "bullmq";
import fs from "fs/promises";
import path from "path";
import { UPLOADS_BUCKET } from "../config/app-config";
import { transcodePath } from "../config/path-config";
import connection from "../config/redis-config";
import { downloadFile, uploadTranscodedFiles } from "../service/storage-service";
import transcodeVideo from "../service/transcode-service";

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

    console.log(`Starting transcoding for videoId: ${videoId}, fileName: ${fileName}`);

    try {
      // Create output directory for transcoded files
      await fs.mkdir(outputDir, { recursive: true });

      // Step 1 : Download the file from minio
      downloadedFilePath = await downloadFile(UPLOADS_BUCKET, videoId, fileName);

      // Step 2 : Transcode the video using ffmpeg
      await transcodeVideo(downloadedFilePath, outputDir);

      // Step 3 : Upload the transcoded files back to minio
      await uploadTranscodedFiles(videoId, outputDir);
    } catch (error) {
      // Log error and rethrow to let BullMQ handle job failure
      console.error(`Transcoding job failed for videoId: ${videoId}`, error);
      throw error;
    } finally {
      // Clean up the output directory
      await fs.rm(outputDir, { recursive: true, force: true });
      await fs.rm(downloadedFilePath);
    }
  },
  { connection }
);

export default transcodeWorker;
