import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import path from "path";
import { errorMiddleware } from "./api/middlewares/error.middleware";
import notfoundMiddleware from "./api/middlewares/notfound.middleware";
import router from "./api/routes";
import { corsOptions } from "./utils/cors-options";

const app = express();

// Cors
app.use(cors(corsOptions as cors.CorsOptions));

// Public Directory
app.use(express.static(path.join(__dirname, "public")));

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

app.use("/api", router);

// Not found middleware
app.use(notfoundMiddleware);

// Error Handling Middleares
app.use(errorMiddleware);

export default app;
