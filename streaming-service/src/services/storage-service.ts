import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import storageClient from "../config/storage-config";
import { PlaylistResponse } from "../types/playlist-response";
import { streamToBuffer } from "../utils/stream-to-buffer";
import streamToString from "../utils/stream-to-string";

async function getDataAsBuffer(bucket: string, key: string): Promise<Buffer> {
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

async function pipeBuffer(bucket: string, key: string): Promise<NodeJS.ReadableStream> {
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

async function getPlaylist(Bucket: string, Key: string): Promise<PlaylistResponse> {
  try {
    const command = new GetObjectCommand({ Bucket, Key });
    const response = await storageClient.send(command);

    if (!response.Body) {
      throw new Error("getPlaylist: No data returned from storage service.");
    }

    const stream = response.Body as Readable;
    const data = await streamToString(stream);

    return {
      ...response,
      data,
    };
  } catch (error) {
    // Log error details if you have a logger, e.g., logger.error(error)
    throw new Error(`getPlaylist: Failed to retrieve playlist: ${(error as Error).message}`);
  }
}

const storageService = {
  getDataAsBuffer,
  pipeBuffer,
  getPlaylist,
};

export default storageService;
