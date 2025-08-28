import jwt from "jsonwebtoken";

export function generateStreamToken(videoId: string): string {
  const payload = {
    videoId,
  };

  const secret = process.env.EXPIRE_TIME;
  if (!secret) throw new Error("STREAM_JWT_SECRET missing");

  const expiresIn = process.env.EXPIRE_TIME ?? "1h";

  return jwt.sign(payload, process.env.STREAM_JWT_SECRET as string, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function generateStreamUrl(videoId: string): string {
  const baseUrl = process.env.STREAM_SERVICE_ENDPOINT;
  if (!baseUrl) throw new Error("STREAM_SERVICE_ENDPOINT missing");

  return `${baseUrl}/stream/${videoId}`;
}
