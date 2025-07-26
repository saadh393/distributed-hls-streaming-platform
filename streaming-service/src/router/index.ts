import express from "express";
import { streamService } from "../service/stream-service";

const router = express.Router();

router.get("/:videoId", streamService);

export default router;
