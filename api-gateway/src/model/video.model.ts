import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { VIDEO_STATUS } from "../config/contrains";
import { user_table } from "./user.model";

export const statusEnum = pg.pgEnum("status", [
  VIDEO_STATUS.UPLOADING,
  VIDEO_STATUS.PROCESSING,
  VIDEO_STATUS.TRANSCODING,
  VIDEO_STATUS.SUCCESS,
  VIDEO_STATUS.PUBLISHED,
  VIDEO_STATUS.CORRUPTED,
]);

export const video_table = pg.pgTable(
  "video",
  {
    id: pg.varchar().primaryKey(),
    title: pg.varchar({ length: 255 }),
    description: pg.varchar({ length: 255 }),
    thumbnail: pg.varchar({ length: 255 }),
    duration: pg.varchar({ length: 10 }),
    status: statusEnum().default(VIDEO_STATUS.UPLOADING),
    uploader: pg.bigint("uploader_id", { mode: "number" }).references(() => user_table.id, { onDelete: "cascade" }),
  },
  (t) => ({
    uploaderIndex: pg.index("uploader_index").on(t.uploader),
  })
);

export const video_relations = relations(video_table, ({ one }) => ({
  publisher: one(user_table, {
    fields: [video_table.uploader],
    references: [user_table.id],
  }),
}));
