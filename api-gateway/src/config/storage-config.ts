import { S3Client } from "@aws-sdk/client-s3";

const endPoint = `http://${process.env.MINIO_HOST}:${process.env.MINIO_PORT || 9000}`;

const storageConfig = new S3Client({
  endpoint: endPoint,
  forcePathStyle: true,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER || "ROOTUSER",
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD || "CHANGEME123",
  },
});

export default storageConfig;
