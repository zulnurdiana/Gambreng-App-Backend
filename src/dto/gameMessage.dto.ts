import { z } from 'zod';

export const createGameMessageSchema = z.object({
  gameForumId: z.string(),
  message: z.string(),
});

export const updateGameMessageSchema = z.object({
  gameId: z.string(),
  message: z.string(),
});

export const getGameMessageSchema = z.object({
  gameId: z.string(),
});