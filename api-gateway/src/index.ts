import app from "./app";
import { PORT } from "./config/contrains";
import { validateEnv } from "./utils/env-validator";
import "./worker/index";

try {
  validateEnv([
    "PORT",
    "DATABASE_URL",
    "JWT_SECRET",
    "CORS_ORIGINS",
    "NODE_ENV",
    "UPLOAD_SERVICE_ENDPOINT",
    "UPLOAD_JWT_SECRET",
    "STREAM_SERVICE_ENDPOINT",
    "STREAM_JWT_SECRET",
    "EXPIRE_TIME",
    "REDIS_HOST",
    "REDIS_PORT",
    "MINIO_HOST",
    "MINIO_PORT",
    "MINIO_ROOT_USER",
    "MINIO_ROOT_PASSWORD",
    "TRANSCODE_BUCKET",
  ]);
} catch (err) {
  console.error(err);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log("🚀 Server is running at http://localhost:" + PORT);
});
