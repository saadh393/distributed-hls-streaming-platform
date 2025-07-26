import { Request, Response } from "express";
import { M3U8_BUCKET } from "../config/app-config";
import { signedUrl } from "../config/storage-config";

const resolutions = [
  // { name: "1080p", width: 1920, height: 1080, bandwidth: 5000000 },
  // { name: "720p", width: 1280, height: 720, bandwidth: 2800000 },
  // { name: "480p", width: 854, height: 480, bandwidth: 1400000 },
  { name: "360p", width: 640, height: 360, bandwidth: 800000 },
];

export async function streamService(req: Request, res: Response) {
  const videoId = req.params.videoId;
  const playlistUrls = [];

  for (const res of resolutions) {
    const playlist = `${videoId}/${res.name}.m3u8`;
    const url = await signedUrl(M3U8_BUCKET, playlist);
    playlistUrls.push({
      ...res,
      url,
    });
  }

  const master = playlistUrls.map(
    (playable) =>
      `#EXT-X-STREAM-INF:BANDWIDTH=${playable.bandwidth},RESOLUTION=${playable.width}x${playable.height}\n${playable.url}`
  );
  res.set("Content-Type", "application/vnd.apple.mpegurl");
  res.send(`#EXTM3U\n${master.join("\n")}`);
}
