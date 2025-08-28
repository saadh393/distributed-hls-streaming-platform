import { IS_PROD } from "../config/app-config";

const allowlist = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const corsOptions = {
  origin: function (origin: string, cb: Function) {
    if (!origin) return cb(null, true);

    // allowlist match
    if (allowlist.includes(origin)) return cb(null, true);

    try {
      const { hostname, protocol } = new URL(origin);

      if (IS_PROD && protocol !== "https:") {
        return cb(new Error("Protocol Not allowed by CORS"));
      }

      if (allowlist.includes(origin) || allowlist.includes(hostname)) {
        return cb(null, true);
      }
    } catch (e) {}

    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Total-Count"],
  maxAge: 600, // preflight cache 10min
};
