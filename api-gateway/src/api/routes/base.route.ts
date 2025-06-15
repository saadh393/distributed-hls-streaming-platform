import express from "express";
import { homePage } from "../controller/base.controller";

const baseRouter = express.Router();

baseRouter.get("/", homePage);

export default baseRouter;
