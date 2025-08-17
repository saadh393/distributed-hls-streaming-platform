import z4 from "zod/v4";

const passwordSchema = z4
  .string()
  .min(8, { message: "Password must be at least 8 characters" }) // not empty + min length
  .max(64, { message: "Password must not exceed 64 characters" })
  .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Must contain at least one digit" })
  .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character" });

export default passwordSchema;
