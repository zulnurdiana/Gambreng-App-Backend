import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Email must be a valid email address'),
  password: z.string().min(8, { message: 'Passwords must be at least 8 characters long' }),
  confirmPassword: z.string().min(8, { message: 'Passwords must be at least 8 characters long' })
});