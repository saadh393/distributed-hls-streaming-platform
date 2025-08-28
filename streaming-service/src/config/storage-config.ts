import { S3Client } from "@aws-sdk/client-s3";

const endPoint = `${process.env.MINIO_HOST}:${process.env.MINIO_PORT}`;

const storageClient = new S3Client({
  region: process.env.MINIO_REGION as string,
  endpoint: endPoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER as string,
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD as string,
  },
});

export default storageClient;
