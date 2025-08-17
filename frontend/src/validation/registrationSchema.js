import { z } from 'zod';
import { sanitizeEmail, sanitizeName, stripZeroWidth } from '../utils/strings';

// helper functions
const hasLetter = (s) => /[A-Za-z]/.test(s);
const hasNumber = (s) => /\d/.test(s);

// প্রি-প্রসেস: আগে স্যানিটাইজ, পরে রুলস
const firstNameSchema = z.preprocess(
  (v) => sanitizeName(String(v ?? '')),
  z.string().min(2, 'First name must be at least 2 characters.').max(50)
);

const lastNameSchema = z.preprocess(
  (v) => sanitizeName(String(v ?? '')),
  // allow empty as optional
  z.string().max(50).or(z.literal('')).optional()
);

export const emailSchema = z.preprocess(
  (v) => sanitizeEmail(String(v ?? '')),
  z.string().email('Enter a valid email address.')
);


export const passwordSchema = z.preprocess(
  (v) => stripZeroWidth(String(v ?? '')).trim(),
  z.string()
    .min(8, 'Use 8+ characters.')
    .refine((s) => hasLetter(s) && hasNumber(s), 'Use letters and numbers.')
    .refine((s) => !/\s/.test(s), 'No spaces in password.')
);

export const registrationSchema = z
  .object({
    name: firstNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
   
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
