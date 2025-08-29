import "dotenv/config";

import { TRANSCODED_BUCKET } from "./config/app-config";
import bucketInit from "./utils/bucket-init";
import validateEnv from "./utils/env-validator";
import "./worker/transcode-worker";

try {
  validateEnv();
  bucketInit(TRANSCODED_BUCKET).then(() => {});
} catch (error) {
  console.error("Environment validation failed:", error);
  process.exit(1);
}
