import { Queue } from "bullmq";
import IORedis from "ioredis";

const connectionConfig: any = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
};

// Only add password if it's provided
if (process.env.REDIS_PASSWORD) {
  connectionConfig.password = process.env.REDIS_PASSWORD;
}

const connection = new IORedis(connectionConfig);

// Add connection event listeners for debugging
connection.on("connect", () => {
  console.log("Queue Redis connected successfully");
});

connection.on("error", (err) => {
  console.error("Queue Redis connection error:", err);
});

export const videoQueue = new Queue("videoQueue", { connection });
export const trandcodeQueue = new Queue("transcodeQueue", { connection });
