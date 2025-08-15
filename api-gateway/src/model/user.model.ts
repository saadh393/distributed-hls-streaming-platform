import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { video_table } from "./video.model";

export const user_table = pg.pgTable("user", {
  id: pg.bigserial({ mode: "number" }).primaryKey(),
  name: pg.varchar({ length: 255 }).notNull(),
  email: pg.varchar({ length: 255 }).notNull().unique(),
  password: pg.varchar({ length: 72 }).notNull(),
});

export const user_relation = relations(user_table, ({ many }) => ({
  videos: many(video_table),
}));
