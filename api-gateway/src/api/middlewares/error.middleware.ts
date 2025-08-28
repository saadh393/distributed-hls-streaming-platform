import { NextFunction, Request, Response } from "express";
import ApiError from "../../utils/ApiError";

export function errorMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ error: error.message });
  } else {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
