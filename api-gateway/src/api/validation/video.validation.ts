import * as zod from "zod/v4";

export const createVideoValidator = zod.object({
  video_id: zod.string("Video id is missing"),
  title: zod.string(),
  description: zod.string(),
});

export const updateVideoValidator = zod.object({
  title: zod.string().optional(),
  description: zod.string().optional(),
  status: zod.string().optional(),
});
