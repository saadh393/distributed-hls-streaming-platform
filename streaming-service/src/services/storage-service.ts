import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import storageClient from "../config/storage-config";
import { streamToBuffer } from "../utils/stream-to-buffer";

export async function getDataAsBuffer(bucket: string, key: string): Promise<Buffer> {
  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const out = await storageClient.send(command);

    if (!out.Body) {
      throw new Error("getDataAsBuffer: No data returned from storage service.");
    }

    const buf = await streamToBuffer(out.Body as unknown as Readable);
    return buf;
  } catch (error) {
    throw new Error(`getDataAsBuffer: Failed to get data as buffer: ${(error as Error).message}`);
  }
}

export async function pipeBuffer(bucket: string, key: string): Promise<NodeJS.ReadableStream> {
  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const out = await storageClient.send(command);

    if (!out.Body) {
      throw new Error("pipeBuffer: No data returned from storage service.");
    }

    return out.Body as unknown as NodeJS.ReadableStream;
  } catch (error) {
    throw new Error(`pipeBuffer: Failed to pipe buffer: ${(error as Error).message}`);
  }
}

const storageService = {
  getDataAsBuffer,
  pipeBuffer,
};

export default storageService;
