import express from "express";
import authRouter from "./auth.route";
import baseRouter from "./base.route";
import videoRoute from "./video.route";

const router = express.Router();

router.use(baseRouter);

router.use("/auth", authRouter);
router.use("/video", videoRoute);

export default router;
