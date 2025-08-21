import z4 from "zod/v4";

export const fileSchema = z4.object({
  fileName: z4.string("File name is Required"),
  totalChunks: z4.number("Number of total Chunk is required"),
  videoId: z4.string("Video id is required"),
});
