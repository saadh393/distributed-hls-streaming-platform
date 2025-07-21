import { CreateBucketCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import storageConfig from "../config/storage-config";

export default async function bucketInit(bucketName: string) {
  const bucketListCommand = new ListBucketsCommand({});
  const bucketList = await storageConfig.send(bucketListCommand);

  const buckets = bucketList.Buckets?.map((obj) => obj.Name);

  if (!buckets?.includes(bucketName)) {
    const newBucket = new CreateBucketCommand({ Bucket: bucketName });
    await storageConfig.send(newBucket);
  }
}
