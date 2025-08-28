// /src/components/HlsPlayer.js
import Hls from "hls.js/dist/hls.js";
import React, { useRef, useEffect } from "react";

export default function HlsPlayer({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari natively supports HLS
        videoRef.current.src = src;
      } else if (Hls.isSupported()) {
        // For other browsers use hls.js
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error", data);
        });

        return () => {
          hls.destroy();
        };
      }
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay={false}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
