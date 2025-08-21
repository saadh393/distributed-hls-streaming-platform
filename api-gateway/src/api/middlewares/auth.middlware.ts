import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({
        message: "Not authenticated",
      });
      return;
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // @ts-ignore
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
}
