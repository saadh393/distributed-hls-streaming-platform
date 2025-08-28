import { M3U8_BUCKET } from "../config/app-config";
import storageService from "../services/storage-service";

/**
 * Load AES key bytes for a video from secure storage.
 * Options:
 *   1) Separate private bucket: keys/hls/{vid}/key.bin
 *   2) DB/blob: swap this for a DB call returning Buffer(16)
 * Keep keys private; never expose object paths publicly.
 */
export default async function loadAesKeyBytes(videoId: string): Promise<Buffer> {
  const Key = `${videoId}/keys/key.bin`;
  const buf = await storageService.getDataAsBuffer(M3U8_BUCKET, Key);

  return buf;
}
