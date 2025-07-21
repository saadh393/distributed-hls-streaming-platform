export const NUMBER_OF_CONCURRENT_UPLOADS = Number(process.env.NUMBER_OF_CONCURRENT_UPLOADS) || 5;
export const TRANSCODED_BUCKET = process.env.TRANSCODED_BUCKET || "transcoded-videos";
export const UPLOADS_BUCKET = process.env.UPLOADS_BUCKET || "videos";
