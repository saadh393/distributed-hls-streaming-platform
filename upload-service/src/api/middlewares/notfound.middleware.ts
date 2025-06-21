import { NextFunction, Request, Response } from "express";

export default function NotFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    status: "Error",
    message: "Resource Not Found",
  });
}
