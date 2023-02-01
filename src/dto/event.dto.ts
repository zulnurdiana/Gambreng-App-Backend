import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string(),
  image: z.string(),
  schedule: z.string(),
  locaton: z.string(),
  about: z.string(),
  contact_person: z.string(),
  link_map: z.string(),
});

export const deleteEventSchema = z.object({
  eventId: z.string(),
});

export const updateEventSchema = z.object({
  eventId: z.string(),
});



export const getAllEventSchema = z.object({
  page: z.number(),
  limit: z.number(),
});

export const getDetailEventSchema = z.object({
});