import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db_connection } from "../../config/db-config";
import { video_table } from "../../model/video.model";
import { UserType } from "../../types/express";
import generateId from "../../utils/generate-id";

const db = db_connection();

async function getVideos(req: Request, res: Response) {
  try {
    const videos = await db.select().from(video_table);
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
  const { video_id, title } = req.body;

  const value = {
    title,
    id: video_id,
    uploader: user.id,
  };

  const [response] = await db.insert(video_table).values(value).returning();

  res.json(response);
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

const videoController = { getVideos, createVideo, initVideoUpload };

export default videoController;
