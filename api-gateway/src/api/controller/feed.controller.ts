import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";
import { VIDEO_STATUS } from "../../config/contrains";
import { db_connection } from "../../config/db-config";
import { user_table } from "../../model/user.model";
import { video_table } from "../../model/video.model";
import { generateStreamToken, generateStreamUrl } from "../../services/stream-service";

const db = db_connection();

async function getVideos(req: Request, res: Response) {
  try {
    const videos = await db
      .select({
        id: video_table.id,
        title: video_table.title,
        description: video_table.description,
        thumbnail: video_table.thumbnail,
        duration: video_table.duration,
        status: video_table.status,
        uploader: {
          id: video_table.uploader,
          name: user_table.name,
          email: user_table.email,
        },
      })
      .from(video_table)
      .innerJoin(user_table, eq(video_table.uploader, user_table.id))
      .where(eq(video_table.status, VIDEO_STATUS.PUBLISHED));

    res.json(videos);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

async function getVideo(req: Request, res: Response) {
  const { videoId } = req.params;
  try {
    const video = await db
      .select({
        id: video_table.id,
        title: video_table.title,
        description: video_table.description,
        thumbnail: video_table.thumbnail,
        duration: video_table.duration,
        status: video_table.status,
        uploader: {
          id: video_table.uploader,
          name: user_table.name,
          email: user_table.email,
        },
      })
      .from(video_table)
      .where(and(eq(video_table.id, videoId), eq(video_table.status, VIDEO_STATUS.PUBLISHED)))
      .innerJoin(user_table, eq(video_table.uploader, user_table.id));

    if (!video.length) {
      return res.status(404).json({ message: "Video not found" });
    }

    const token = generateStreamToken(videoId);
    const streamUrl = generateStreamUrl(videoId);

    res.json({ ...video[0], videoUrl: `${streamUrl}?token=${token}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

const feedController = { getVideos, getVideo };

export default feedController;
