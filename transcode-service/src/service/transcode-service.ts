// src/transcode/transcodeVideo.ts
import path from "node:path";
import { DEFAULT_RENDITIONS } from "../config/default-renditions";
import { TranscodeOptions } from "../types/transcode-types";
import { makeDeterministicIvHex } from "../utils/crypto-utils";
import { runFFmpeg } from "../utils/ffmpeg-utils";
import { ensureDir, writeKeyFiles, writeMaster } from "../utils/fs-utils";

/**
 * Transcode into HLS TS for given renditions + optional AES-128 encryption.
 * Output layout:
 *   {outRoot}/{videoId}/master.m3u8
 *   {outRoot}/{videoId}/{360p}/index.m3u8
 *   {outRoot}/{videoId}/{360p}/seg_00001.ts
 */
export async function transcodeVideo(opts: TranscodeOptions): Promise<{ outDir: string }> {
  const {
    videoId,
    inputPath,
    outRootDir,
    renditions = DEFAULT_RENDITIONS,
    segmentSeconds = 4,
    gopSeconds = 4,
    preset = "veryfast",
    crf = 23,
    encrypt = false,
    keyUrlBase = "",
    keyStoreDir = path.join(outRootDir, "keys"),
    ivHex = undefined,
  } = opts;
  console.log(opts);

  const outDir = outRootDir;
  ensureDir(outDir);

  // Prepare AES key-info if encryption enabled
  let keyInfoPath: string | undefined;
  if (encrypt) {
    const iv = ivHex ?? makeDeterministicIvHex(videoId);
    if (!keyUrlBase) throw new Error("keyUrlBase is required when encrypt=true");
    const files = writeKeyFiles(keyStoreDir, videoId, keyUrlBase, iv);
    keyInfoPath = files.keyInfoPath;
  }

  // For each rendition, run a dedicated ffmpeg
  for (const r of renditions) {
    const rDir = path.join(outDir, r.name);
    ensureDir(rDir);

    const segmentPattern = path.join(rDir, "seg_%05d.ts"); // 00001.ts ...
    const indexPath = path.join(rDir, "index.m3u8");

    // GOP assumptions—if source is ~12 fps, gop=48=>4s
    const gop = Math.max(1, Math.round((48 * gopSeconds) / 4)); // keeps 48 when gopSeconds=4

    const args = [
      "-y",
      "-i",
      inputPath,

      // VIDEO
      "-c:v",
      "libx264",
      "-profile:v",
      "main",
      "-pix_fmt",
      "yuv420p",
      "-preset",
      preset,
      "-crf",
      String(crf),
      "-vf",
      `scale=w=${r.width}:h=${r.height}:flags=lanczos`,
      "-sc_threshold",
      "0",
      "-g",
      String(gop),
      "-keyint_min",
      String(gop),

      // AUDIO
      "-c:a",
      "aac",
      "-b:a",
      `${r.aBitrateKbps}k`,
      "-ac",
      "2",
      "-ar",
      "48000",

      // Rate control (CBR-ish ladder; tune as needed)
      "-b:v",
      `${r.vBitrateKbps}k`,
      "-maxrate",
      `${r.vMaxrateKbps}k`,
      "-bufsize",
      `${r.vBufsizeKbps}k`,

      // HLS
      "-hls_time",
      String(segmentSeconds),
      "-hls_playlist_type",
      "vod",
      "-hls_flags",
      "independent_segments",
      "-hls_segment_filename",
      segmentPattern,
    ];

    if (encrypt && keyInfoPath) {
      args.push("-hls_key_info_file", keyInfoPath);
    }

    args.push(indexPath);

    await runFFmpeg(args);
  }

  // Write master.m3u8 (child URIs relative)
  writeMaster(outDir, renditions);

  return { outDir };
}
