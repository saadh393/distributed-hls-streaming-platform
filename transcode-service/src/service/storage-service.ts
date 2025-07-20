import { GetObjectCommand } from "@aws-sdk/client-s3";
import { createWriteStream } from "fs";
import path from "path";
import { Readable } from "stream";
import { downloadPath } from "../config/path-config";
import storageConfig from "../config/storage-config";

async function downloadFile(BUCKET: string, videoId: string, fileName: string): Promise<void> {
  // These will taken as param in future
  const writePath = path.join(downloadPath, fileName);

  const stream = createWriteStream(writePath);
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: videoId,
  });

  const response = await storageConfig.send(command);
  const responseStream = response.Body as Readable;

  return new Promise<void>((resolve, reject) => {
    if (responseStream) {
      responseStream
        .pipe(stream)
        .on("pipe", () => {
          console.log("File download started...");
        })
        .on("finish", () => {
          console.log("File downloaded successfully to:", writePath);
          resolve();
        })
        .on("error", reject);
    } else {
      reject(new Error("Response body is undefined"));
    }
  });
}

export { downloadFile };
