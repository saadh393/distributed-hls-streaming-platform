import { spawn } from "node:child_process";

export function runFFmpeg(args: string[], cwd?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ff = spawn("ffmpeg", args, { cwd });
    ff.stderr.on("data", (d) => process.stderr.write(`FFmpeg: ${d}`));
    ff.on("exit", (code) => {
      if (code === 0) return resolve();
      reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}
