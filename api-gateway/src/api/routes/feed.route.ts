import express from "express";
import feedController from "../controller/feed.controller";

const feedRoute = express.Router();

feedRoute.get("/", feedController.getVideos);

// @ts-ignore
feedRoute.get("/:videoId", feedController.getVideo);

export default feedRoute;
