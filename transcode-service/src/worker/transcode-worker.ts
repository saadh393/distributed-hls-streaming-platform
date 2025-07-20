import { Worker } from "bullmq";
import connection from "../config/redis-config";

const transcodeWorker = new Worker(
  "transcodeQueue",
  async (job) => {
    console.log("Processing job:", job);
  },
  { connection: connection }
);

export default transcodeWorker;
