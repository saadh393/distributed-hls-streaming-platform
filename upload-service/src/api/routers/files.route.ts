import express from "express";
import catchAsync from "../../utils/async-catch";
import fileController from "../controllers/file.controller";
import { multerMiddleware } from "../middlewares";
import validateRequest from "../middlewares/validation.middleware";
import { createUserSchema } from "../schemas/files.schema";

const router = express.Router();

router.post("/upload/init", validateRequest(createUserSchema), catchAsync(fileController.init));

router.post("/upload/:videoId/complete", catchAsync(fileController.uploadChunk));

router.post("/upload/:videoId/:chunkIndex", multerMiddleware.single("chunk"), catchAsync(fileController.complete));

export default router;
