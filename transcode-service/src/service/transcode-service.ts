const { spawn } = require("child_process");
import fs from "fs";
import path from "path";

const resolutions = [
  // { name: "1080p", width: 1920, height: 1080, bandwidth: 5000000 },
  // { name: "720p", width: 1280, height: 720, bandwidth: 2800000 },
  // { name: "480p", width: 854, height: 480, bandwidth: 1400000 },
  { name: "360p", width: 640, height: 360, bandwidth: 800000 },
];

export default function transcodeVideo(inputPath: string, outputDir: string): Promise<string> {
  const args: string[] = [];
  resolutions.forEach((res, i) => {
    args.push(
      "-vf",
      `scale=w=${res.width}:h=${res.height}`,
      "-c:a",
      "aac",
      "-ar",
      "48000",
      "-c:v",
      "h264",
      "-profile:v",
      "main",
      "-crf",
      "20",
      "-sc_threshold",
      "0",
      "-g",
      "48",
      "-keyint_min",
      "48",
      "-hls_time",
      "4",
      "-hls_playlist_type",
      "vod",
      "-b:v",
      `${(res.width / 1000) * 2}k`,
      "-maxrate",
      `${(res.width / 1000) * 2.5}k`,
      "-bufsize",
      `${(res.width / 1000) * 3}k`,
      "-hls_segment_filename",
      `${outputDir}/${res.name}_%03d.ts`,
      `${outputDir}/${res.name}.m3u8`
    );
  });

  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", ["-i", inputPath, ...args]);

    ffmpeg.stderr.on("data", (data: Buffer) => {
      console.log(`FFmpeg: ${data.toString()}`);
    });

    ffmpeg.on("exit", (code: number) => {
      if (code === 0) {
        let masterContent = "#EXTM3U\n#EXT-X-VERSION:3\n\n";
        resolutions.forEach((res) => {
          masterContent += `#EXT-X-STREAM-INF:BANDWIDTH=${res.bandwidth},RESOLUTION=${res.width}x${res.height}\n`;
          masterContent += `${res.name}.m3u8\n\n`;
        });

        fs.writeFileSync(path.join(outputDir, "master.m3u8"), masterContent);
        resolve("Transcoding complete");
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
  });
}
