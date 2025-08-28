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
    avgBandwidth: (800 + 128) * 1000,
    bandwidth: (1000 + 128) * 1000,
  },
];
