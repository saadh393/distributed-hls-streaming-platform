import express from "express";
import baseRouter from "./base.route";

const router = express.Router();

router.use(baseRouter);

export default router;
