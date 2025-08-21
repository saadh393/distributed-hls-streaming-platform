import fs from "fs";
import path from "path";
import sharp from "sharp";

type Score = {
  file: string;
  brightness: number; // 0..255
  contrast: number; // stddev of luma
  edge: number; // simple edge proxy
  letterboxRatio: number; // % black borders
  score: number;
};

async function analyzeImage(p: string): Promise<Score> {
  const img = sharp(p).removeAlpha().greyscale();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  const w = info.width,
    h = info.height;
  // 1) brightness (avg luma)
  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += data[i];
  const brightness = sum / data.length; // 0..255

  // 2) contrast (stddev)
  let sq = 0;
  for (let i = 0; i < data.length; i++) sq += Math.pow(data[i] - brightness, 2);
  const contrast = Math.sqrt(sq / data.length);

  // 3) edge proxy: sobel না করেও “high‑frequency” আন্দাজ
  // কেন্দ্র পিক্সেল vs চারপাশের গড়
  let edgeSum = 0,
    count = 0;
  for (let y = 1; y < h - 1; y += 2) {
    for (let x = 1; x < w - 1; x += 2) {
      const idx = y * w + x;
      const c = data[idx];
      let n = 0;
      const neigh = data[idx - w] + data[idx + w] + data[idx - 1] + data[idx + 1];
      const mean = neigh / 4;
      edgeSum += Math.abs(c - mean);
      count++;
    }
  }
  const edge = edgeSum / Math.max(1, count);

  // 4) letterbox detection: উপরে/নীচে কালো বর্ডারের অনুপাত
  const threshold = 8; // 0..255 এর মধ্যে "কালো" ধরলাম
  function blackRow(y: number): boolean {
    let rowSum = 0;
    for (let x = 0; x < w; x++) rowSum += data[y * w + x];
    return rowSum / w < threshold;
  }
  let top = 0,
    bottom = 0;
  while (top < h * 0.25 && blackRow(top)) top++;
  while (bottom < h * 0.25 && blackRow(h - 1 - bottom)) bottom++;
  const letterboxRatio = (top + bottom) / h; // 0..1

  // 5) final score (ওয়েটিং টিউনেবল)
  // ডার্ক/লেটারবক্স পেনাল্টি, কনট্রাস্ট/এজ পুরস্কার
  const score =
    contrast * 1.0 + edge * 1.5 + (brightness < 35 ? -100 : 0) + (letterboxRatio > 0.1 ? -50 * letterboxRatio : 0);

  return { file: p, brightness, contrast, edge, letterboxRatio, score };
}

export async function pickBestThumbnail(candsDir: string): Promise<string | null> {
  const files = fs
    .readdirSync(candsDir)
    .filter((f) => f.match(/\.jpe?g$|\.webp$/i))
    .map((f) => path.join(candsDir, f));

  if (!files.length) return null;
  const results = await Promise.all(files.map(analyzeImage));

  // হালকা ফিল্টার: অতিরিক্ত ডার্ক/লেটারবক্স বাদ
  const filtered = results.filter((r) => r.brightness >= 30 && r.letterboxRatio <= 0.2);

  const pick = (filtered.length ? filtered : results).sort((a, b) => b.score - a.score)[0];

  return pick?.file ?? null;
}
