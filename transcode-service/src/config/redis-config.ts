import Redis from "ioredis";
require("dotenv").config();

const connectionConfig: any = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
};

const connection = new Redis(connectionConfig);

connection.on("error", (err) => {
  console.error("Redis connection error:", err);
});

connection.on("connect", () => {
  console.log("Redis connected successfully");
});

export default connection;
