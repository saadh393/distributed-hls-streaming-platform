import * as zod from "zod/v4";

export const tokenSchema = zod.object({
  videoId: zod.string(),
  userId: zod.number(),
  action: zod.number(),
});
