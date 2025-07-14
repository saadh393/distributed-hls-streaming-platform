import { queuedDir, tmpdir } from "./config/config";
import minio from "./config/minio";
import app from "./server";
import bucketInit from "./utils/minio-bucket-init";
import validateDir from "./utils/validate-dir";
import { startWorker } from "./worker/video-process";

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  await validateDir(tmpdir);
  await validateDir(queuedDir);

  // Start the worker
  try {
    startWorker();
  } catch (error) {
    console.error("Failed to start worker:", error);
  }

  // if connection established then check the bucket initialization
  minio.listBuckets().then(bucketInit);

  console.log(`🚀 Upload Server is listening at http://localhost:${PORT}`);
});
