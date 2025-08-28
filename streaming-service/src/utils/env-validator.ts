export function validateEnv() {
  const missing = [];
  const requiredEnvVars = [
    "MINIO_ROOT_USER",
    "MINIO_ROOT_PASSWORD",
    "MINIO_HOST",
    "MINIO_PORT",
    "MINIO_REGION",

    "PORT",
    "M3U8_BUCKET",
    "STREAM_JWT_SECRET",

    "REDIS_HOST",
    "REDIS_PORT",
  ];

  for (const key of requiredEnvVars) {
    if (!process.env[key] || process.env[key].trim() === "") {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    const errorMessage = `
❌ Missing required environment variables:
${missing.map((v) => `- ${v}`).join("\n")}

👉 Please check your .env file or environment configuration.
    `;
    throw new Error(errorMessage);
  }
}

export default validateEnv;
