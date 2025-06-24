import { z } from "zod/v4";

export const createUserSchema = z.object({
  body: z.object({
    fileName: z.string("File name is Required"),
    totalChunks: z.number("Number of total Chunk is required"),
  }),
});
