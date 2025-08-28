import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function requirePlayback(req: Request, res: Response, next: NextFunction) {
  const { videoId } = req.params;
  const token = req.query.token as string;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.STREAM_JWT_SECRET as string);
    console.log(decoded, videoId);
    // @ts-ignore
    if (decoded?.videoId !== videoId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
