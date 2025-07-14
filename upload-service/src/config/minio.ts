import { Client } from "minio";

export const BUCKET = "videos";

export const minio = new Client({
  endPoint: "localhost",
  port: 9000,
  accessKey: "ROOTUSER",
  secretKey: "CHANGEME123",
});

export default minio;
