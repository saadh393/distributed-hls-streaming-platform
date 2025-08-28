const isHttpUrl = (s: string) => /^https?:\/\//i.test(s);
const isComment = (s: string) => s.trim().startsWith("#");
const trim = (s: string) => s.replace(/\r?\n/g, "").trim();

function augmentStreamInf(line: string): string {
  // Example: ensure VERSION present at top-level; here we just passthrough the INF line.
  // If you want to enforce CODECS, parse and merge attributes here.
  return line;
}

export default function rewriteMasterWithToken(raw: string, videoId: string, token: string): string {
  const lines = raw.split("\n");
  const out: string[] = [];
  let expectingUri = false;

  for (let i = 0; i < lines.length; i++) {
    const original = lines[i];
    const line = trim(original);

    if (!line) {
      out.push("");
      expectingUri = false;
      continue;
    }

    if (isComment(line)) {
      // Normalize a bit: keep #EXTM3U/#EXT-X-VERSION as-is; augment STREAM-INF if needed.
      if (line.startsWith("#EXT-X-STREAM-INF")) {
        out.push(augmentStreamInf(line));
        expectingUri = true; // Next non-comment line must be the child URI
      } else {
        out.push(line);
        expectingUri = false;
      }
      continue;
    }

    // Non-comment line (potential child URI)
    if (expectingUri) {
      // Folder structure - /video_id/360p/index.m3u8
      // line should be like - 360p/index.m3u8
      // rewrite to handle this route hls/:videoId/:resolution/index.m3u8?token=<token>

      const child = `/stream/hls/${encodeURIComponent(videoId)}/${line}?token=${encodeURIComponent(token)}`;
      out.push(child);
      expectingUri = false;
    } else {
      // If a stray non-comment line appears (not after STREAM-INF), pass through;
      // but in well-formed masters this should not happen.
      out.push(line);
    }
  }

  // Ensure required header lines exist (idempotent)
  if (!out.some((l) => l.startsWith("#EXTM3U"))) {
    out.unshift("#EXTM3U");
  }
  if (!out.some((l) => l.startsWith("#EXT-X-VERSION"))) {
    // Version 3 is safe for classic TS HLS; adjust if you serve CMAF/fMP4.
    out.splice(1, 0, "#EXT-X-VERSION:3");
  }

  // Final newline for player leniency
  return out.join("\n") + "\n";
}
