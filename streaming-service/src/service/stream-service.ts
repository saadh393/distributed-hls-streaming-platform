import { Request, Response } from "express";
import { M3U8_BUCKET } from "../config/app-config";
import { getPlaylist } from "../config/storage-config";
import rewriteMasterWithToken from "../utils/rewrite-master-with-token";

const resolutions = [
  // { name: "1080p", width: 1920, height: 1080, bandwidth: 5000000 },
  // { name: "720p", width: 1280, height: 720, bandwidth: 2800000 },
  // { name: "480p", width: 854, height: 480, bandwidth: 1400000 },
  { name: "360p", width: 640, height: 360, bandwidth: 800000 },
];

export async function streamService(req: Request, res: Response) {
  const videoId = req.params.videoId;
  const token = req.query.token as string;

  try {
    const { data, ContentType } = await getPlaylist(M3U8_BUCKET, videoId + "/master.m3u8");
    const body = rewriteMasterWithToken(data, videoId, token);

    res.setHeader("Content-Type", ContentType as string);
    res.setHeader("Cache-Control", "private, max-age=5, stale-while-revalidate=30");

    return res.status(200).send(body);
  } catch (err) {
    throw err;
  }
}
