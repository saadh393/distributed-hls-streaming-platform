import "dotenv/config";

import { TRANSCODED_BUCKET } from "./config/app-config";
import bucketInit from "./utils/bucket-init";
import "./worker/transcode-worker";

bucketInit(TRANSCODED_BUCKET).then(() => {});
