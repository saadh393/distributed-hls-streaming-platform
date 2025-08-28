import { Request, Response } from "express";
import { M3U8_BUCKET } from "../config/app-config";

import storageService from "../services/storage-service";
import loadAesKeyBytes from "../utils/load-aes-key";
import rewriteMasterWithToken from "../utils/rewrite-master-with-token";
import rewriteVariantWithToken from "../utils/rewrite-varient-token";

async function master_playlist(req: Request, res: Response) {
  const videoId = req.params.videoId;
  const token = req.query.token as string;

  const { data, ContentType } = await storageService.getPlaylist(M3U8_BUCKET, videoId + "/master.m3u8");
  const body = rewriteMasterWithToken(data, videoId, token);

  res.setHeader("Content-Type", ContentType as string);
  res.setHeader("Cache-Control", "private, max-age=5, stale-while-revalidate=30");

  return res.status(200).send(body);
}

async function resolution_playlist(req: Request, res: Response) {
  const videoId = req.params.videoId;
  const resolution = req.params.resolution;
  const token = req.query.token as string;

  const KEY = `${videoId}/${resolution}/index.m3u8`; // 2ak1913/360p/index.m3u8
  const { data, ContentType } = await storageService.getPlaylist(M3U8_BUCKET, KEY);

  const options = { rendition: resolution, token, videoId, aes128: true, injectKeyWhenMissing: false };
  const body = rewriteVariantWithToken(data, options);

  res.setHeader("Content-Type", ContentType as string);
  res.setHeader("Cache-Control", "private, max-age=5, stale-while-revalidate=30");

  return res.status(200).send(body);
}

async function decryption_key(req: Request, res: Response) {
  const videoId = req.params.videoId as string;
  const token = req.query.token as string;

  // Implement your decryption key logic here
  const keyBytes = await loadAesKeyBytes(videoId);

  // Security headers
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("X-Content-Type-Options", "nosniff");

  return res.status(200).send(keyBytes);
}

async function video_segments(req: Request, res: Response) {
  const { videoId, resolution, segment } = req.params as {
    videoId: string;
    resolution: string;
    segment: string;
  };

  const objectKey = `${videoId}/${resolution}/${segment}`;
  const streams = await storageService.pipeBuffer(M3U8_BUCKET, objectKey); // Prevent memory offload

  // Handle File Streaming Error
  streams.on("error", (e) => {
    console.error("[video_segments] error", { videoId, resolution, segment, message: e.message });
    res.status(502).json({ error: "Upstream video segment error" });
  });

  streams.pipe(res);
}

const streamController = {
  master_playlist,
  resolution_playlist,
  decryption_key,
  video_segments,
};

export default streamController;
