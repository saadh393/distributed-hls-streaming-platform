import { Request, Response } from "express";
import { db_connection } from "../../config/db-config";
import { video_table } from "../../model/video.model";
import { UserType } from "../../types/express";

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

const videoController = { getVideos, createVideo };

export default videoController;
