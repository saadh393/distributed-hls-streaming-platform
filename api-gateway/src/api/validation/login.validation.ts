import z4 from "zod/v4";
import passwordSchema from "./password.validation";

export const loginValidator = z4.object({
  email: z4.email("Please enter a valid email address"),
  password: passwordSchema,
});
