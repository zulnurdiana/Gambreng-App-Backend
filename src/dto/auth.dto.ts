import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Email must be a valid email address'),
  password: z.string().min(8, { message: 'Passwords must be at least 8 characters long' }),
  confirmPassword: z.string().min(8, { message: 'Passwords must be at least 8 characters long' })
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwod and confirm password must be same',
    })
  }
});

export const signInSchema = z.object({
  email: z.string().email('Email must be a valid email address'),
  password: z.string().min(8, { message: 'Passwords must be at least 8 characters long' })
});