import { Queue } from "bullmq";
import connection from "./config/redis-config";

const messageQueue = new Queue("transcodeQueue", { connection: connection });

messageQueue.add("transcodeJob", {
  videoId: "12345",
  userId: "67890",
});
