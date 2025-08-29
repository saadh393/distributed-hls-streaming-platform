export const PORT = process.env.PORT || 3000;

export const VIDEO_STATUS = {
  UPLOADING: "uploading",
  PROCESSING: "processing",
  TRANSCODING: "transcoding",
  SUCCESS: "success",
  PUBLISHED: "published",
  CORRUPTED: "corrupted",
  ERROR: "error",
};

export const TRANSCODE_BUCKET = process.env.TRANSCODE_BUCKET;
