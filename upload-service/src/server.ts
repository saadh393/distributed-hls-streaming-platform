import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandlingMiddleware, notFoundMiddleware } from "./api/middlewares";
import { filesRouter } from "./api/routers";

// Immediately Setting up .env
dotenv.config();

const app = express();

app.use(cors());

// Help secure Express apps by setting HTTP response headers
app.use(helmet());

// Middleware for logging
app.use(morgan("dev"));

// Routing
app.use("/files", filesRouter);

// Not Found
app.use(notFoundMiddleware);

// Error Handling
app.use(errorHandlingMiddleware);

export default app;
