import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { user_table } from "./user.model";

export const video_table = pg.pgTable(
  "video",
  {
    id: pg.bigserial({ mode: "number" }).primaryKey(),
    title: pg.varchar({ length: 255 }).notNull(),
    thumbnail: pg.varchar({ length: 255 }).notNull(),
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
