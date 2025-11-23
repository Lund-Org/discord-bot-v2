import { prisma } from '@discord-bot-v2/prisma';
import z from 'zod';

import { TServer } from '../types';
import { getAuthedProcedure } from '../middleware';
import { gameTypeMapping, REGION } from '@discord-bot-v2/igdb';
import { convertTs } from '~/lundprod/utils/trpc/date-to-string';
import { expectedGameSchema } from '../common-schema';

const addExpectedGameInput = z.object({
  gameId: z.number(),
  name: z.string(),
  game_type: z.enum(Object.values(gameTypeMapping) as [string, ...string[]]),
  url: z.string(),
  addToBacklog: z.boolean(),
  region: z.nativeEnum(REGION),
  platformId: z.number(),
});
const addExpectedGameOutput = z.object({
  expectedGame: expectedGameSchema,
});

export type AddExpectedGameInputType = z.infer<typeof addExpectedGameInput>;
export type AddExpectedGameOutputType = z.infer<typeof addExpectedGameOutput>;

export const addExpectedGameProcedure = (t: TServer) => {
  return getAuthedProcedure(t)
    .input(addExpectedGameInput)
    .output(addExpectedGameOutput)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;

      const user = await prisma.user.findUniqueOrThrow({
        where: { discordId: session.userId },
      });

      const expectedGame = await prisma.expectedGame.create({
        data: {
          userId: user.id,
          addToBacklog: input.addToBacklog,
          igdbId: input.gameId,
          url: input.url,
          name: input.name,
          releaseDate: {
            create: {
              region: input.region,
              platformId: input.platformId,
            },
          },
        },
        include: {
          releaseDate: {
            omit: {
              expectedGameId: true,
            },
          },
        },
      });

      return {
        expectedGame: convertTs(expectedGame, [
          'createdAt',
          'updatedAt',
          'releaseDate.date',
        ]),
      };
    });
};
