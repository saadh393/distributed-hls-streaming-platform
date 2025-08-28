import fs from "node:fs";
import path from "node:path";
import { Rendition } from "../types/transcode-types";
import { genAesKeyBytes } from "./crypto-utils";
import logger from "./logger";

export function ensureDir(p: string) {
  logger.info("ensureDir : " + p);
  fs.mkdirSync(p, { recursive: true });
}

export function writeMaster(outDir: string, renditions: Rendition[]) {
  const lines: string[] = ["#EXTM3U", "#EXT-X-VERSION:3"];
  for (const r of renditions) {
    lines.push(
      `#EXT-X-STREAM-INF:BANDWIDTH=${r.bandwidth},AVERAGE-BANDWIDTH=${r.avgBandwidth},RESOLUTION=${r.width}x${r.height},CODECS="${r.codecs}"`,
      `${r.name}/index.m3u8`
    );
  }
  fs.writeFileSync(path.join(outDir, "master.m3u8"), lines.join("\n") + "\n", "utf8");
}

export function writeKeyFiles(
  keyStoreDir: string,
  videoId: string,
  keyUrlBase: string,
  ivHex?: string
): { keyBinPath: string; keyInfoPath: string } {
  const keyDir = keyStoreDir;
  ensureDir(keyDir);

  const keyBinPath = path.join(keyDir, "key.bin");
  const keyInfoPath = path.join(keyDir, "key_info.txt");
  if (!fs.existsSync(keyBinPath)) fs.writeFileSync(keyBinPath, genAesKeyBytes());

  const keyUri = `${keyUrlBase.replace(/\/+$/, "")}/${encodeURIComponent(videoId)}/key`;
  const lines = [keyUri, keyBinPath];

  if (ivHex) lines.push(ivHex);
  fs.writeFileSync(keyInfoPath, lines.join("\n"), "utf8");

  return { keyBinPath, keyInfoPath };
}
