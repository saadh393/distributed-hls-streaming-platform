import { S3Client } from "@aws-sdk/client-s3";

const endPoint = `${process.env.STORAGE_HOST}:${process.env.STORAGE_PORT}`;

const storageConfig = new S3Client({
  endpoint: endPoint,
  forcePathStyle: true,
  region: process.env.STORAGE_REGION as string,
  credentials: {
    accessKeyId: process.env.STORAGE_ROOT_USER as string,
    secretAccessKey: process.env.STORAGE_ROOT_PASSWORD as string,
  },
});

export default storageConfig;
