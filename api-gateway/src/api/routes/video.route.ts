import express from "express";
import videoController from "../controller/video.controller";
import authMiddleware from "../middlewares/auth.middlware";
import { validator } from "../middlewares/validator.middlware";
import { createVideoValidator } from "../validation/video.validation";

const videoRoute = express.Router();

videoRoute.get("/", authMiddleware, videoController.getVideos);

videoRoute.get("/init", authMiddleware, videoController.initVideoUpload);

videoRoute.post("/", authMiddleware, validator(createVideoValidator), videoController.createVideo);

videoRoute.get("/thumbnail/:videoId", authMiddleware, videoController.getThumbnail);

export default videoRoute;
