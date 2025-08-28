import { Request, Response } from "express";
import { M3U8_BUCKET } from "../config/app-config";
import { getPlaylist } from "../config/storage-config";
import rewriteVariantWithToken from "../utils/rewrite-varient-token";

export default async function hlsService(req: Request, res: Response) {
  const videoId = req.params.videoId;
  const resolution = req.params.resolution;
  const token = req.query.token as string;

  try {
    const { data, ContentType } = await getPlaylist(M3U8_BUCKET, `${videoId}/${resolution}/index.m3u8`);

    const body = rewriteVariantWithToken(data, {
      rendition: resolution,
      token,
      videoId,
      aes128: true,
      injectKeyWhenMissing: false,
    });

    res.setHeader("Content-Type", ContentType as string);
    res.setHeader("Cache-Control", "private, max-age=5, stale-while-revalidate=30");

    return res.status(200).send(body);
  } catch (err) {
    throw err;
  }
}
