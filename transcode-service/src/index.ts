import dotenv from "dotenv";
import transcodeVideo from "./service/transcode-service";
dotenv.config();

// import "./worker/transcode-worker";

transcodeVideo(
  "/Users/sadh/Programming/video-streaming-platform/video.mov",
  "/Users/sadh/Programming/video-streaming-platform/"
);
