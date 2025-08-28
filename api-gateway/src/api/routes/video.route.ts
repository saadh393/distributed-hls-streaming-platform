import express from "express";
import videoController from "../controller/video.controller";
import authMiddleware from "../middlewares/auth.middlware";
import { validator } from "../middlewares/validator.middlware";
import { createVideoValidator, updateVideoValidator } from "../validation/video.validation";

const videoRoute = express.Router();

videoRoute.get("/", authMiddleware, videoController.getVideos);

videoRoute.get("/init", authMiddleware, videoController.initVideoUpload);

videoRoute.post("/", authMiddleware, validator(createVideoValidator), videoController.createVideo);

videoRoute.get("/thumbnail/:videoId", videoController.getThumbnail);

// Update video details
videoRoute.patch("/:id", authMiddleware, validator(updateVideoValidator), videoController.updateVideo);

// Delete video
videoRoute.delete("/:id", authMiddleware, videoController.deleteVideo);

export default videoRoute;
