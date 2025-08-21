import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers?.authorization;
  if (!authHeader || authHeader.split(" ")[0] !== "Bearer") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    // @ts-ignore
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.UPLOAD_JWT_SECRET as string) as any;

    if (decoded?.action !== "upload") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // @ts-ignore
    req.user = decoded;
    // @ts-ignore
    req.body = { ...req.body, videoId: decoded.videoId };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
