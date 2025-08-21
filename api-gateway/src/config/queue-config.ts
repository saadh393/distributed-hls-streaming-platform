import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
};

export const redisConnection = new Redis(connection);

export const videoQueue = new Queue("video", { connection: redisConnection });
