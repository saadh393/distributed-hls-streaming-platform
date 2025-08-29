import { Job } from "bullmq";

export interface TranscodeJobMeta {
  videoId: string;
  fileName: string;
  extension: string;
  totalChunks: number;
  recievedChunks: number;
}

export interface TranscodeJobData {
  meta: TranscodeJobMeta;
}

export type TranscodeJob = Job<TranscodeJobData>;
