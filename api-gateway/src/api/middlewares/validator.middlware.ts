import { NextFunction, Request, Response } from "express";
import { ZodSchema, z as zod } from "zod";
// @ts-ignore
import { createErrorMap, fromError } from "zod-validation-error";

zod.config({
  customError: createErrorMap(),
});

export const validator =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const error = fromError(result.error);
      res.status(400).json({
        errors: error.details,
      });
      return;
    }

    // req.body = result;
    next();
  };
