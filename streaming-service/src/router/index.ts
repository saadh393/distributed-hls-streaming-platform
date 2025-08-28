import express from "express";
import hlsService from "../service/hls-service";
import { keyService } from "../service/key-service";
import segmentStream from "../service/segment-stream";
import { streamService } from "../service/stream-service";

const router = express.Router();

router.get("/:videoId", streamService);
router.get("/hls/:videoId/:resolution/index.m3u8", hlsService);
router.get("/hls/:videoId/key", keyService); // for AES-128 key delivery
router.get("/hls/:videoId/:resolution/segment/:segment", segmentStream); // for TS/fMP4 segments
export default router;
