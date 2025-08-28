import path from "node:path";

const isDirective = (s: string) => s.trim().startsWith("#");
const isAbsoluteUrl = (s: string) => /^https?:\/\//i.test(s);
const strip = (s: string) => s.replace(/\r?\n/g, "").trim();

type VariantRewriteOpts = {
  videoId: string;
  rendition: string;
  token: string;

  aes128?: boolean;

  injectKeyWhenMissing?: boolean;
  ivHex?: string;
};

function withToken(url: string, token: string): string {
  // append ?token=... (or &token=...) safely
  return url.includes("?") ? `${url}&token=${encodeURIComponent(token)}` : `${url}?token=${encodeURIComponent(token)}`;
}

/**
 * Rewrite a variant playlist:
 *  - Segment URIs -> stream/hls/:videoId/:resolution/<seg>?token=...
 *  - #EXT-X-KEY URI -> /hls/:vid/key?token=...
 *  - Preserve all other lines and ordering
 */
export default function rewriteVariantWithToken(raw: string, opts: VariantRewriteOpts): string {
  const { videoId, rendition, token, aes128, injectKeyWhenMissing, ivHex } = opts;

  const lines = raw.split("\n");
  const out: string[] = [];

  // Track whether we saw a KEY line, to optionally inject if required
  let sawKey = false;

  for (let i = 0; i < lines.length; i++) {
    const original = lines[i];
    const line = strip(original);

    if (!line) {
      out.push("");
      continue;
    }

    if (isDirective(line)) {
      // KEY line handling
      if (line.startsWith("#EXT-X-KEY")) {
        sawKey = true;
        if (aes128) {
          // Replace only URI="..." part, keep METHOD/IV/KEYFORMAT attrs as-is
          const keyUriAttr = /URI="([^"]+)"/i;
          const securedKeyUri = `URI="${withToken(`/stream/hls/${encodeURIComponent(videoId)}/key`, token)}"`;
          const replaced = line.match(keyUriAttr)
            ? line.replace(keyUriAttr, securedKeyUri)
            : `${line},${securedKeyUri}`; // very rare: URI missing—append it
          out.push(replaced);
        } else {
          // Not enforcing AES here—pass through unchanged
          out.push(line);
        }
      } else {
        // Other directives: pass through unchanged
        out.push(line);
      }
      continue;
    }

    // Non-directive = a URI line: usually a segment path (e.g., "360p_000.ts")
    // Leave absolute URLs alone unless you explicitly want to gate them too.
    if (isAbsoluteUrl(line)) {
      // If absolute URLs are present and you want to gate them as well,
      // you could convert them to your /hls route. Keeping as-is here:
      out.push(line);
    } else {
      // Relative segment -> route through your secured segment endpoint with token
      const segName = path.basename(line); // keep the exact name
      const secured = withToken(
        `/stream/hls/${encodeURIComponent(videoId)}/${encodeURIComponent(rendition)}/segment/${segName}`,
        token
      );
      out.push(secured);
    }
  }

  // Optional: If encryption is required but playlist had no KEY line, inject one near the top
  if (aes128 && injectKeyWhenMissing && !sawKey) {
    const keyLine = `#EXT-X-KEY:METHOD=AES-128,URI="${withToken(
      `/stream/hls/${encodeURIComponent(videoId)}/key`,
      token
    )}"${ivHex ? `,IV=0x${ivHex}` : ""}`;
    // Insert after header/version lines to keep things neat
    const insertAt = Math.min(
      Math.max(
        out.findIndex((l) => l.startsWith("#EXT-X-VERSION")),
        0
      ) + 1,
      out.length
    );
    out.splice(insertAt, 0, keyLine);
  }

  return out.join("\n") + "\n";
}
