import { DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import storageConfig from "../../config/storage-config";

async function deleteFolder(bucket: string, folderKey: string) {
  if (!folderKey.endsWith("/")) {
    folderKey += "/";
  }

  let continuationToken = undefined;

  do {
    // 1. List objects under the prefix
    const listResp = await storageConfig.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: folderKey,
        ContinuationToken: continuationToken,
      })
    );

    if (!listResp.Contents || listResp.Contents.length === 0) {
      break;
    }

    // 2. Build objects array for deletion
    const objectsToDelete = listResp.Contents.map((item) => ({
      Key: item.Key,
    }));

    // 3. Delete in batch
    await storageConfig.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: { Objects: objectsToDelete },
      })
    );

    continuationToken = listResp.IsTruncated ? listResp.NextContinuationToken : undefined;
  } while (continuationToken);

  console.log(`✅ Deleted folder ${folderKey} from bucket ${bucket}`);
}

const storageService = {
  deleteFolder,
};

export default storageService;
