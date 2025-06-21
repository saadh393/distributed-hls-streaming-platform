import fs from "fs/promises";

/**
 * Validate Dir - If folder is not exists, then it will create it-self
 * @param path - Path to Validate
 */
export default async function validateDir(path: string) {
  try {
    await fs.mkdir(path, { recursive: true });
  } catch (e) {
    throw e;
  }
}
