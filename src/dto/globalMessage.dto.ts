import { z } from 'zod';

export const createGlobalMessageSchema = z.object({
  message: z.string(),
});

export const updateGlobalMessageSchema = z.object({
  messageId: z.string(),
  message: z.string(),
});
