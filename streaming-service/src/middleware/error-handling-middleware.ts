import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/api-error";

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  // Default values
  let statusCode = 500;
  let responseBody: Record<string, any> = {
    error: {
      type: "InternalServerError",
      message: "Something went wrong",
    },
  };

  // If it's an ApiError, extract details
  if (err instanceof ApiError) {
    statusCode = err.statusCode || 500;
    responseBody = {
      error: {
        type: "ApiError",
        message: err.message,
        statusCode: err.statusCode,
      },
    };
  } else {
    // For debugging (optional, in dev only)
    console.error("Unhandled error:", err);
  }

  res.status(statusCode).json(responseBody);
}
