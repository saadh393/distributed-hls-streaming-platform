import express from "express";
import { loginController, meController, registrationController } from "../controller/auth.controller";
import authMiddleware from "../middlewares/auth.middlware";
import { validator } from "../middlewares/validator.middlware";
import { loginValidator } from "../validation/login.validation";
import { registerValidator } from "../validation/register.validation";

const authRouter = express.Router();

authRouter.post("/register", validator(registerValidator), registrationController);
authRouter.post("/login", validator(loginValidator), loginController);
authRouter.get("/me", authMiddleware, meController);

export default authRouter;
