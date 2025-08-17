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
      const isAllowedSub = hostname.endsWith(".example.com") && (protocol === "https:" || protocol === "http:");
      if (isAllowedSub) return cb(null, true);
    } catch (e) {}

    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Total-Count"],
  maxAge: 600, // preflight cache 10min
};
