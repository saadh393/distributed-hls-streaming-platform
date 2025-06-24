import type { NextFunction, Request, Response } from "express";

export default function catchAsync(cb: Function) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(cb(req, res, next)).catch((err) => next(err));
  };
}
