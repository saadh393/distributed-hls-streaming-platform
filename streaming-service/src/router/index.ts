import express from "express";
import streamController from "../controller/stream-controllers";
import requirePlayback from "../middleware/require-playback-middleware";
import catchAsync from "../utils/async-catch";

const router = express.Router();

// Returns the Master Playlist with the :resolution/index.m3u8 paths
router.get("/:videoId", requirePlayback, catchAsync(streamController.master_playlist));

// Returns the Variant Playlist for a specific resolution
router.get("/hls/:videoId/:resolution/index.m3u8", requirePlayback, catchAsync(streamController.resolution_playlist));

// Returns the Decryption Key for a specific video
router.get("/hls/:videoId/key", requirePlayback, catchAsync(streamController.decryption_key));

// Returns the Video Segments for a specific resolution
router.get("/hls/:videoId/:resolution/segment/:segment", requirePlayback, catchAsync(streamController.video_segments));

export default router;
