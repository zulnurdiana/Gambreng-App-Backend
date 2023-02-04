import { z } from 'zod';

export const getDetailGameForumSchema = z.object({
  gamesId: z.string().uuid(),
});