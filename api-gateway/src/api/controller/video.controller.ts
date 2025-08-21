import { GetObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db_connection } from "../../config/db-config";
import storageConfig from "../../config/storage-config";
import { video_table } from "../../model/video.model";
import { UserType } from "../../types/express";
import generateId from "../../utils/generate-id";

const db = db_connection();

async function getVideos(req: Request, res: Response) {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const videos = await db.select().from(video_table).where(eq(video_table.uploader, userId));
    res.json(videos);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

async function createVideo(req: Request, res: Response) {
  const user = <UserType>req.user;
  const { video_id, title, description } = req.body;

  const value = {
    title,
    description,
  };

  const [response] = await db.update(video_table).set(value).where(eq(video_table.id, video_id)).returning();

  res.json({
    message: "Success",
    data: response,
  });
}

async function initVideoUpload(req: Request, res: Response) {
  const videoId = generateId();

  // @ts-ignore
  const userId = req?.user.id;

  const payload = {
    videoId,
    userId,
    action: "upload",
  };

  const token = jwt.sign(payload, process.env.UPLOAD_JWT_SECRET as string, {
    expiresIn: "1h",
    issuer: "api-gateway",
  });

  const uploadUrl = `${process.env.UPLOAD_SERVICE_ENDPOINT}/files/upload/init`;

  // Creating Database Entry
  const db = db_connection();
  await db.insert(video_table).values({ id: videoId, uploader: userId }).execute();

  res.json({ token, uploadUrl, origin: process.env.UPLOAD_SERVICE_ENDPOINT });
}

async function getThumbnail(req: Request, res: Response) {
  try {
    // 1) authz: ensure user can view this video
    const { videoId } = req.params;

    // 2) key from DB
    const key = `${videoId}/thumbnail.webp`;

    // 3) get object and stream
    // @ts-ignore
    const cmd = new GetObjectCommand({ Bucket: "transcoded-videos", Key: key });
    // @ts-ignore
    const out = await storageConfig.send(cmd);

    // propagate content headers for caching on the browser side
    res.setHeader("Content-Type", out.ContentType || "image/webp");
    if (out.ContentLength) res.setHeader("Content-Length", String(out.ContentLength));
    if (out.ETag) res.setHeader("ETag", out.ETag);
    if (out.LastModified) res.setHeader("Last-Modified", out.LastModified.toUTCString());

    // reasonable caching; bust by changing the key if you replace the thumbnail
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");

    (out.Body as any).pipe(res);
  } catch (e) {
    if ((e as any).$metadata?.httpStatusCode === 404) {
      res.redirect(302, "/placeholder.webp"); // optional fallback
    }
  }
}

const videoController = { getVideos, createVideo, initVideoUpload, getThumbnail };

export default videoController;
