import express from "express";
import authController from "../controller/auth.controller";
import authMiddleware from "../middlewares/auth.middlware";
import { validator } from "../middlewares/validator.middlware";
import { loginValidator } from "../validation/login.validation";
import { registerValidator } from "../validation/register.validation";

const authRouter = express.Router();

authRouter.post("/register", validator(registerValidator), authController.registration);
authRouter.post("/login", validator(loginValidator), authController.login);
authRouter.get("/me", authMiddleware, authController.me);
authRouter.post("/logout", authController.logout);

export default authRouter;
