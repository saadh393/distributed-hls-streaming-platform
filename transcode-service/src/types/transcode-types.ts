export type Rendition = {
  name: string; // "360p"
  width: number; // 640
  height: number; // 360
  // target bitrates (rough guide; tune freely)
  vBitrateKbps: number; // e.g., 800
  vMaxrateKbps: number; // e.g., 1000
  vBufsizeKbps: number; // e.g., 1200
  aBitrateKbps: number; // e.g., 128
  codecs: string; // 'avc1.4d401f,mp4a.40.2'
  avgBandwidth: number; // estimate in bits/s (for master)
  bandwidth: number; // peak in bits/s (for master)
};

export type TranscodeOptions = {
  videoId: string;
  inputPath: string; // absolute/relative OK
  outRootDir: string; // e.g., ./transcoded or a temp dir before upload
  renditions?: Rendition[]; // if not given, we’ll use 360p default
  segmentSeconds?: number; // default 4
  gopSeconds?: number; // default 4 (=> gop = fps*gopSeconds; we’ll assume 12 fps * 4 = 48; safe)
  preset?: "veryfast" | "faster" | "fast" | "medium" | "slow";
  crf?: number; // default 23
  encrypt?: boolean; // AES-128 on/off
  // Where the player will fetch key from (STREAMING SERVICE). Example: "https://api.example.com/hls"
  // Final key URI in playlist will be: `${keyUrlBase}/${videoId}/key`
  keyUrlBase?: string;
  // Where to store the raw 16-byte key (server-side private). Example: `${outRootDir}/keys`
  keyStoreDir?: string;
  // Optional deterministic IV (hex). If not provided, ffmpeg uses sequence-based IV; both are fine.
  ivHex?: string;
};
