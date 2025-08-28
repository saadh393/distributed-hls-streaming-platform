import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { createReadStream, createWriteStream } from "fs";
import fs from "fs/promises";
import pLimit from "p-limit";
import path from "path";
import { Readable } from "stream";
import { NUMBER_OF_CONCURRENT_UPLOADS, TRANSCODED_BUCKET } from "../config/app-config";
import { downloadPath } from "../config/path-config";
import storageConfig from "../config/storage-config";
import collectFilesRecursively from "../utils/collect-files-utils";

async function downloadFile(BUCKET: string, videoId: string, fileName: string): Promise<string> {
  // These will taken as param in future
  const writePath = path.join(downloadPath, fileName);

  const stream = createWriteStream(writePath);
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: videoId,
  });

  const response = await storageConfig.send(command);
  const responseStream = response.Body as Readable;

  return new Promise<string>((resolve, reject) => {
    if (responseStream) {
      responseStream
        .pipe(stream)
        .on("pipe", () => {
          console.log("File download started...");
        })
        .on("finish", () => {
          console.log("File downloaded successfully to:", writePath);
          resolve(writePath);
        })
        .on("error", reject);
    } else {
      reject(new Error("Response body is undefined"));
    }
  });
}

function getContentType(filePath: string): string {
  if (filePath.endsWith(".m3u8")) return "application/vnd.apple.mpegurl";
  if (filePath.endsWith(".ts")) return "video/MP2T";
  if (filePath.endsWith(".bin")) return "application/octet-stream";
  return "application/octet-stream"; // fallback
}

async function uploadTranscodedFiles(videoId: string, rootPath: string): Promise<void> {
  // Step 1: collect all files (including nested 360p/, 1080p/, keys/)
  const files = await collectFilesRecursively(rootPath);

  if (files.length === 0) {
    console.warn(`No files found to upload for videoId=${videoId}`);
    return;
  }

  // Step 2: setup concurrency control
  const limit = pLimit(NUMBER_OF_CONCURRENT_UPLOADS);

  // Step 3: upload files
  const uploadTasks = files.map((filePath) =>
    limit(async () => {
      const relativeKey = path.relative(rootPath, filePath).replace(/\\/g, "/"); // normalize for S3
      const s3Key = `${videoId}/${relativeKey}`;

      const contentType = getContentType(filePath);

      const uploadCommand = new PutObjectCommand({
        Bucket: TRANSCODED_BUCKET,
        Key: s3Key,
        Body: createReadStream(filePath),
        ContentType: contentType,
      });

      try {
        await storageConfig.send(uploadCommand);
        console.log(`✅ Uploaded: ${s3Key}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${s3Key}:`, error);
        throw error; // Let Promise.all handle failure
      }
    })
  );

  // Step 4: wait for all uploads
  await Promise.all(uploadTasks);

  console.log(`🎉 All files uploaded successfully for videoId=${videoId} to bucket=${TRANSCODED_BUCKET}`);
}

async function uploadThumbnail(videoId: string, path: string) {
  // Check if file exists
  const isExists = await fs.stat(path);
  if (!isExists) {
    throw new Error("File does not exist");
  }

  const uploadCommand = new PutObjectCommand({
    Bucket: TRANSCODED_BUCKET,
    Key: `${videoId}/thumbnail.webp`,
    Body: createReadStream(path),
    ContentType: "image/webp",
  });

  try {
    await storageConfig.send(uploadCommand);

    // remove the file
    await fs.unlink(path);
  } catch (error) {
    console.error("Error uploading thumbnail:", error);
  }
}

export { downloadFile, uploadThumbnail, uploadTranscodedFiles };
