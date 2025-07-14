import { Client } from "minio";

export const BUCKET = "videos";

export const minio = new Client({
  endPoint: process.env.MINIO_HOST || "localhost",
  port: Number(process.env.MINIO_PORT) || 9000,
  accessKey: process.env.MINIO_ROOT_USER || "ROOTUSER",
  secretKey: process.env.MINIO_ROOT_PASSWORD || "CHANGEME123",
  useSSL: false,
});

export default minio;
