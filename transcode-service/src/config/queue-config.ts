import { Queue } from "bullmq";
import connection from "./redis-config";

// api-gateway will update video status
export const video_status_queue = new Queue("video", { connection });
