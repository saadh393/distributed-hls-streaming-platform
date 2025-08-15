import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { EXPIRE_IN } from "./app-config";

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

export async function signedUrl(Bucket: string, Key: string) {
  const command = new GetObjectCommand({ Bucket, Key });
  return await getSignedUrl(storageClient, command, {
    expiresIn: EXPIRE_IN,
  });
}

export default storageClient;
