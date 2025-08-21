import express from "express";
import catchAsync from "../../utils/async-catch";
import fileController from "../controllers/file.controller";
import { multerMiddleware } from "../middlewares";
import authMiddleware from "../middlewares/auth.middleware";
import { validator } from "../middlewares/validation.middleware";
import { fileSchema } from "../schemas/files.schema";

const router = express.Router();
// @ts-ignore
router.post("/upload/init", express.json(), authMiddleware, validator(fileSchema), catchAsync(fileController.init));

// @ts-ignore
router.get("/upload/:videoId/complete", express.json(), authMiddleware, catchAsync(fileController.complete));

// @ts-ignore
router.post(
  "/upload/:videoId/:chunkIndex",
  // catchAsync(authMiddleware),
  multerMiddleware.single("chunk"),
  catchAsync(fileController.uploadChunk)
);

export default router;
