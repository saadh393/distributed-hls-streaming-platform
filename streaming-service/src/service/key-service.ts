// src/controllers/key.controller.ts
import { GetObjectCommand } from "@aws-sdk/client-s3";
import type { Request, Response } from "express";
import { Readable } from "node:stream";
import { M3U8_BUCKET } from "../config/app-config";
import s3Client from "../config/storage-config"; // preconfigured S3Client pointing to MinIO
// import { redis } from "../config/redis";              // optional: for rate-limiting/concurrency
// import { dbHasEntitlement } from "../data/entitlements"; // your entitlement checker

type PlaybackPayload = { sub: string; vid: string; scope?: string; exp?: number; ip?: string; deviceId?: string };

// --- utilities ---
function ensureHex(buf: Buffer) {
  // small sanity: AES-128 key must be 16 bytes
  if (buf.byteLength !== 16) {
    throw Object.assign(new Error("Invalid AES-128 key length"), { code: "BadKeyLen" });
  }
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks);
}

/**
 * Load AES key bytes for a video from secure storage.
 * Options:
 *   1) Separate private bucket: keys/hls/{vid}/key.bin
 *   2) DB/blob: swap this for a DB call returning Buffer(16)
 * Keep keys private; never expose object paths publicly.
 */
async function loadAesKeyBytes(videoId: string): Promise<Buffer> {
  const Key = `${videoId}/keys/key.bin`;
  const out = await s3Client.send(new GetObjectCommand({ Bucket: M3U8_BUCKET, Key }));
  // MinIO may return Body as stream
  const buf = await streamToBuffer(out.Body as unknown as Readable);

  return buf;
}

export async function keyService(req: Request, res: Response) {
  const { videoId } = req.params as { videoId: string };
  const play: PlaybackPayload | undefined = (req as any).play;
  const token = (req.query.token as string | undefined) ?? req.headers.authorization?.replace(/^Bearer\s+/i, "");

  // --- basic guards ---
  if (!videoId) return res.status(400).json({ error: "Missing videoId" });
  if (!play && !token) return res.status(401).json({ error: "Missing playback token" });
  if (play && play.vid !== videoId) return res.status(403).json({ error: "Forbidden for this video" });

  try {
    const keyBytes = await loadAesKeyBytes(videoId);

    // Security headers: never cache; avoid sniffing
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("X-Content-Type-Options", "nosniff");

    // observability (avoid logging raw bytes!)
    // console.info("[keyService] served", { sub: play?.sub, videoId });

    return res.status(200).send(keyBytes);
  } catch (err: any) {
    const code = err?.code || err?.name;
    if (code === "NoSuchKey" || code === "NotFound") {
      return res.status(404).json({ error: "Key not found" });
    }
    if (code === "BadKeyLen") {
      // key object is corrupted/wrong size—block playback
      return res.status(500).json({ error: "Corrupted encryption key" });
    }
    console.error("[keyService] error", { videoId, code, message: err?.message });
    return res.status(502).json({ error: "Upstream key storage error" });
  }
}
