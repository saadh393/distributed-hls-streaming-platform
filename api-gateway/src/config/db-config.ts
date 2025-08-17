import "dotenv/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as user_schema from "../model/user.model";
import * as video_schema from "../model/video.model";

let connection: NodePgDatabase | any = null;

export function db_connection(): NodePgDatabase {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is undefiened");
  }

  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  if (!connection) {
    connection = drizzle(pool, { schema: { ...video_schema, user_schema } });
  }

  return connection;
}
