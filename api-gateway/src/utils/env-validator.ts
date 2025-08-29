export function validateEnv(requiredEnvVars = []) {
  const missing = [];

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
