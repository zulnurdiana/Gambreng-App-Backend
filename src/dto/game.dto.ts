import { z } from 'zod';

export const createGameSchema = z.object({
  title: z.string(),
  image: z.string(),
  description: z.string(),
  max_player: z.string(),
  origin_game: z.string(),
  procedure: z.array(z.string()),
  link_video: z.string(),
});

export const deleteGameSchema = z.object({
  gameId: z.string(),
});

export const updateGameSchema = z.object({
  gameId: z.string(),
});

export const getAllGameSchema = z.object({
  page: z.number(),
  limit: z.number(),
});

export const getDetailGameSchema = z.object({
  gameId: z.string(),
});