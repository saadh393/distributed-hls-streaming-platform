import crypto from "crypto";

export function makeDeterministicIvHex(videoId: string): string {
  return crypto.createHash("sha256").update(`iv:${videoId}`).digest("hex").slice(0, 32);
}

export function genAesKeyBytes(): Buffer {
  return crypto.randomBytes(16); // 16 bytes for AES-128
}
