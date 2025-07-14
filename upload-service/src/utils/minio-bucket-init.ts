import minio, { BUCKET } from "../config/minio";

export default async function bucketInit() {
  const isBuketExists = await minio.bucketExists(BUCKET);
  if (isBuketExists) {
    console.log("Bucket already exists");
  } else {
    await minio.makeBucket(BUCKET);
  }
}
