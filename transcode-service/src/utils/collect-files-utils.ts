import fs from "fs/promises";
import path from "path";

/**
 * Recursively collects all files inside a folder.
 */
export default async function collectFilesRecursively(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFilesRecursively(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}
