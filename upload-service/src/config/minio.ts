import { Client } from "minio";
import bucketInit from "../utils/minio-bucket-init";

export const BUCKET = "videos";

export const minio = new Client({
  endPoint: "localhost",
  port: 9000,
  accessKey: "ROOTUSER",
  secretKey: "CHANGEME123",
});

// if connection established then check the bucket initialization
minio.listBuckets().then(bucketInit);

export default minio;
