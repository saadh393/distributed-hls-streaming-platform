import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/api-error";

export default function requirePlayback(req: Request, res: Response, next: NextFunction) {
  const { videoId } = req.params;
  const token = req.query.token as string;

  if (!token) {
    throw new ApiError("No token provided", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.STREAM_JWT_SECRET as string);
    console.log(decoded, videoId);
    // @ts-ignore
    if (decoded?.videoId !== videoId) {
      throw new ApiError("Forbidden", 403);
    }
    return next();
  } catch (error) {
    console.log(error);
    throw new ApiError("Something went wrong", 500);
  }
}
