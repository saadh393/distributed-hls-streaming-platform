import { Rendition } from "../types/transcode-types";

export const DEFAULT_RENDITIONS: Rendition[] = [
  {
    name: "360p",
    width: 640,
    height: 360,
    vBitrateKbps: 800,
    vMaxrateKbps: 1000,
    vBufsizeKbps: 1200,
    aBitrateKbps: 128,
    codecs: "avc1.4d401f,mp4a.40.2", // H.264 Main@3.1 + AAC-LC
    avgBandwidth: (800 + 128) * 1000, // ~928 kbps
    bandwidth: (1000 + 128) * 1000, // ~1128 kbps
  },
];

export const renditions = [
  {
    name: "360p",
    width: 640,
    height: 360,
    vBitrateKbps: 800,
    vMaxrateKbps: 1000,
    vBufsizeKbps: 1200,
    aBitrateKbps: 128,
    codecs: "avc1.4d401f,mp4a.40.2",
    avgBandwidth: (800 + 128) * 1000, // ~928,000 bps
    bandwidth: (1000 + 128) * 1000, // ~1,128,000 bps
  },
  {
    name: "480p",
    width: 854,
    height: 480,
    vBitrateKbps: 1400,
    vMaxrateKbps: 1600,
    vBufsizeKbps: 2100,
    aBitrateKbps: 128,
    codecs: "avc1.4d401f,mp4a.40.2",
    avgBandwidth: (1400 + 128) * 1000, // ~1,528,000 bps
    bandwidth: (1600 + 128) * 1000, // ~1,728,000 bps
  },
  {
    name: "720p",
    width: 1280,
    height: 720,
    vBitrateKbps: 2800,
    vMaxrateKbps: 3500,
    vBufsizeKbps: 4200,
    aBitrateKbps: 128,
    codecs: "avc1.4d401f,mp4a.40.2",
    avgBandwidth: (2800 + 128) * 1000, // ~2,928,000 bps
    bandwidth: (3500 + 128) * 1000, // ~3,628,000 bps
  },
  {
    name: "1080p",
    width: 1920,
    height: 1080,
    vBitrateKbps: 5000,
    vMaxrateKbps: 6000,
    vBufsizeKbps: 7500,
    aBitrateKbps: 192,
    codecs: "avc1.4d401f,mp4a.40.2",
    avgBandwidth: (5000 + 192) * 1000, // ~5,192,000 bps
    bandwidth: (6000 + 192) * 1000, // ~6,192,000 bps
  },
];
