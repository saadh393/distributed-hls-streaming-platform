import express from "express";
import fileController from "../controllers/file.controller";
import { multerMiddleware } from "../middlewares";

const router = express.Router();

router.post("/upload", multerMiddleware.single("file"), fileController.upload);

export default router;
