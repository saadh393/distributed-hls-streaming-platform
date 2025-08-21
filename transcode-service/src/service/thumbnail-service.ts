import { execFile, spawn } from "child_process";
import { promisify } from "util";
const pExec = promisify(execFile);

export async function makeHeroThumbnail(input: string, outPath: string, dur: number) {
  const t = dur > 0 ? Math.floor(dur * 0.25) : 10; // 25% বা fallback 10s

  await new Promise<void>((resolve, reject) => {
    const args = [
      "-ss",
      String(t),
      "-noautorotate",
      "-i",
      input,
      "-frames:v",
      "1",
      "-vf",
      "scale='min(1280,iw)':-1:force_original_aspect_ratio=decrease",
      "-q:v",
      "2",
      "-y",
      outPath,
    ];
    const ff = spawn("ffmpeg", args, { stdio: "inherit" });
    ff.on("exit", (c) => (c === 0 ? resolve() : reject(new Error("ffmpeg hero failed"))));
  });
}
