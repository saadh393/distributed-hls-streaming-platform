import z4 from "zod/v4";
import passwordSchema from "./password.validation";

export const registerValidator = z4.object({
  name: z4.string("Full Name is required").nonempty({ message: "You must have to provide your name" }),
  email: z4.email("Please enter a valid email address"),
  password: passwordSchema,
});
