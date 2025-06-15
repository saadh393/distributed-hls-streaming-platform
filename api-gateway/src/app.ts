import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import errorMiddleware from "./api/middlewares/error.middleware";
import notfoundMiddleware from "./api/middlewares/notfound.middleware";
import router from "./api/routes";
dotenv.config();

const app = express();

// Public Directory
app.use(express.static(path.join(__dirname, "public")));

// Cors
app.use(cors());

app.use(router);

// Not found middleware
app.use(notfoundMiddleware);

// Error Handling Middleares
app.use(errorMiddleware);

export default app;
