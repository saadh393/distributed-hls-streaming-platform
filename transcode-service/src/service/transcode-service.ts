const { spawn } = require("child_process");

const resolutions = [
  { name: "1080p", width: 1920, height: 1080 },
  { name: "720p", width: 1280, height: 720 },
  { name: "480p", width: 854, height: 480 },
  { name: "360p", width: 640, height: 360 },
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
        resolve("Transcoding complete");
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
  });
}
