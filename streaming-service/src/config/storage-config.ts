import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import streamToString from "../utils/stream-to-string";

const endPoint = `http://${process.env.MINIO_HOST}:${process.env.MINIO_PORT}`;

const storageClient = new S3Client({
  region: "us-east-1",
  endpoint: endPoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER || "ROOTUSER",
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD || "CHANGEME123",
  },
});

export async function getPlaylist(
  Bucket: string,
  Key: string
): Promise<{
  data: string;
  ContentType: string | undefined;
  ContentLength: number | undefined;
}> {
  const command = new GetObjectCommand({ Bucket, Key });
  const response = await storageClient.send(command);

  const stream = response.Body as Readable;
  const data = await streamToString(stream);

  return {
    data,
    ContentType: response.ContentType,
    ContentLength: response.ContentLength,
  };
}

export default storageClient;
