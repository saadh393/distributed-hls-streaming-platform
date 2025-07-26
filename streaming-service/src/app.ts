import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middleware/error-handling-middleware";
import notfoundMiddleware from "./middleware/not-found-middleware";
import router from "./router/index";

const app = express();

// Cors protection
// @todo: Only accept request from Api gateway
app.use(cors());

// Use Helmet
app.use(helmet());

// use morgan for logging
app.use(morgan("dev"));

// define route handler
app.use("/stream", router);

// Not Found Middleware
app.use(notfoundMiddleware);

// Error Handling middlewares
app.use(errorHandler);

export default app;
