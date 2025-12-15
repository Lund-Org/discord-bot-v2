import { gameTypeMapping } from '@discord-bot-v2/igdb';
import { prisma } from '@discord-bot-v2/prisma';
import z from 'zod';

import { convertTs } from '~/lundprod/utils/trpc/date-to-string';

import { backlogItemSchema } from '../common-schema';
import { getAuthedProcedure } from '../middleware';
import { TServer } from '../types';

const addBacklogItemInput = z.object({
  gameId: z.number(),
  name: z.string(),
  game_type: z.enum(Object.values(gameTypeMapping) as [string, ...string[]]),
  url: z.string(),
});
const addBacklogItemOutput = z.object({
  backlogItem: backlogItemSchema,
});

export type AddBacklogItemInputType = z.infer<typeof addBacklogItemInput>;
export type AddBacklogItemOutputType = z.infer<typeof addBacklogItemOutput>;

export const addBacklogItemProcedure = (t: TServer) => {
  return getAuthedProcedure(t)
    .input(addBacklogItemInput)
    .output(addBacklogItemOutput)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;

      const user = await prisma.user.findUniqueOrThrow({
        where: { discordId: session.userId },
      });

      const backlogItem = await prisma.$transaction(async (tx) => {
        const lastItemInBacklog = await tx.backlogItem.findFirst({
          where: {
            userId: user.id,
            status: 'BACKLOG',
          },
          select: { order: true },
          orderBy: { order: 'desc' },
        });

        const item = await tx.backlogItem.create({
          data: {
            userId: user.id,
            status: 'BACKLOG',
            game_type: input.game_type,
            igdbGameId: input.gameId,
            name: input.name,
            url: input.url,
            order: (lastItemInBacklog?.order || 0) + 1,
          },
          include: {
            backlogItemReview: {
              include: {
                cons: true,
                pros: true,
              },
            },
          },
        });

        return item;
      });

      return {
        backlogItem: convertTs(backlogItem, [
          'abandonedAt',
          'createdAt',
          'finishedAt',
          'startedAt',
          'updatedAt',
          'wishlistAt',
        ]),
      };
    });
};
