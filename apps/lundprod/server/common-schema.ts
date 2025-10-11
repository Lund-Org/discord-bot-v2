import { GAME_STATUS, GAME_TYPE, REGION } from '@discord-bot-v2/igdb';
import { BacklogStatus } from '@prisma/client';
import z from 'zod';

export const gameStatusSchema = z.nativeEnum(GAME_STATUS);

export const gameTypeSchema = z.nativeEnum(GAME_TYPE);

export const regionSchema = z.nativeEnum(REGION);

export const backlogStatusSchema = z.nativeEnum(BacklogStatus);

export const gameSchema = z.object({
  id: z.number(),
  name: z.string(),
  cover: z
    .union([
      z.object({
        id: z.number(),
        url: z.string(),
      }),
      z.undefined(),
    ])
    .optional(),
  status: z.union([gameStatusSchema, z.undefined()]).optional(),
  storyline: z.string().optional(),
  summary: z.string().optional(),
  version_title: z.string().optional(),
  game_type: gameTypeSchema,
  url: z.string(),
  platforms: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      }),
    )
    .optional(),
  release_dates: z
    .array(
      z.object({
        id: z.number(),
        date: z.number().optional(),
        release_region: regionSchema.optional(),
        human: z.string(),
        platform: z.object({
          id: z.number(),
          name: z.string(),
        }),
      }),
    )
    .optional(),
});

export const backlogItemSchema = z.object({
  backlogItemReview: z
    .object({
      cons: z.array(
        z.object({
          value: z.string(),
        }),
      ),
      pros: z.array(
        z.object({
          value: z.string(),
        }),
      ),
      rating: z.number(),
      review: z.string().nullable(),
      duration: z.number().nullable(),
      completion: z.number().nullable(),
      completionComment: z.string().nullable(),
    })
    .nullable(),
  id: z.number(),
  igdbGameId: z.number(),
  name: z.string(),
  game_type: z.string(),
  url: z.string(),
  status: backlogStatusSchema,
  note: z.string().nullable(),
  order: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
