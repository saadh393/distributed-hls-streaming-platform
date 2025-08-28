import { GetObjectCommand } from "@aws-sdk/client-s3";

import { Request, Response } from "express";
import { M3U8_BUCKET } from "../config/app-config";
import storageClient, { getPlaylist } from "../config/storage-config";
import parseRange from "../utils/parse-range";

export default async function segmentStream(req: Request, res: Response) {
  const { videoId, resolution, segment } = req.params as {
    videoId: string;
    resolution: string;
    segment: string;
  };

  try {
    // transcoded-videos/dLG535fajg
    const objectKey = `${videoId}/${resolution}/${segment}`;

    const clientRange = parseRange(req.headers.range as string | undefined);

    const { data, ContentType, ContentLength } = await getPlaylist(M3U8_BUCKET, objectKey);

    // Handling Range overflow
    if (clientRange && ContentLength !== undefined && clientRange.start >= ContentLength) {
      res.setHeader("Content-Range", `bytes */${ContentLength}`);
      return res.status(416).end();
    }

    const rangeHeader = clientRange && `bytes ${clientRange.start}-${clientRange.end}`;

    const command = new GetObjectCommand({ Bucket: M3U8_BUCKET, Key: objectKey });
    const obj = await storageClient.send(command);

    res.removeHeader("Content-Encoding"); // just in case
    res.setHeader("Vary", "Origin"); // optional
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Type", "video/mp2t"); // force TS; don't leave octet-stream
    // conservative cache for auth-gated path:
    res.setHeader("Cache-Control", "private, max-age=60");

    const upstreamCR = obj.ContentRange as string | undefined;
    const size = Number(obj.ContentLength ?? 0);

    if (rangeHeader) {
      if (upstreamCR) {
        res.setHeader("Content-Range", upstreamCR);
        res.setHeader("Content-Length", String(size));
      }
      res.status(206);
    } else {
      if (size) res.setHeader("Content-Length", String(size));
      res.status(200);
    }

    const bodyStream = obj.Body as unknown as NodeJS.ReadableStream;
    bodyStream.on("error", (e) => {
      if (!res.headersSent) res.status(502).end();
      else res.destroy(e as any);
    });
    bodyStream.pipe(res);
  } catch (err) {
    console.log(err);
    throw err;
  }
}
