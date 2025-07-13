import { Worker } from "bullmq";
import fs from "fs";
import IORedis from "ioredis";

const connection = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || "mypassword",
});

const worker = new Worker(
  "videoProcess",
  async (job) => {
    const { videoId, meta, completePath } = job.data;

    // Upload to Storage Service
    const URL = `http://storage-service:3000/upload/video/${videoId}`;

    const formData = new FormData();
    formData.append("file", fs.createReadStream(completePath));

    formData.append("meta", JSON.stringify(meta));
    const response = await fetch(URL, {
      method: "POST",
      body: formData,
    });
  },
  {
    connection,
  }
);
