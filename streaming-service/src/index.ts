import "dotenv/config";
import app from "./app";
import { PORT } from "./config/app-config";
import validateEnv from "./utils/env-validator";

try {
  validateEnv();
} catch (err) {
  console.error("Environment validation failed:", err);
  process.exit(1);
}

app.listen(PORT, () => console.log("Streaming service is running at PORT - ", PORT));
