import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { createReadStream, createWriteStream } from "fs";
import fs from "fs/promises";
import pLimit from "p-limit";
import path from "path";
import { Readable } from "stream";
import { NUMBER_OF_CONCURRENT_UPLOADS, TRANSCODED_BUCKET } from "../config/app-config";
import { downloadPath } from "../config/path-config";
import storageConfig from "../config/storage-config";

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

async function uploadTranscodedFiles(videoId: string, folderPath: string): Promise<void> {
  const files = await fs.readdir(folderPath);
  const limit = pLimit(NUMBER_OF_CONCURRENT_UPLOADS);

  files.map((file) => {
    const filePath = path.join(folderPath, file);

    let contentType = "application/octet-stream";
    if (file.endsWith(".m3u8")) contentType = "application/vnd.apple.mpegurl";
    if (file.endsWith(".ts")) contentType = "video/MP2T";

    const uploadCommand = new PutObjectCommand({
      Bucket: TRANSCODED_BUCKET,
      Key: `${videoId}/${file}`,
      Body: createReadStream(filePath),
      ContentType: contentType,
    });

    return limit(() => {
      try {
        storageConfig.send(uploadCommand);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    });
  });

  await Promise.all(files);
  console.log("All files uploaded successfully to S3 bucket:", TRANSCODED_BUCKET);
}

export { downloadFile, uploadTranscodedFiles };
