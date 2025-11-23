import z from 'zod';
import { TServer } from '../types';
import { Prisma } from '@prisma/client';
import { prisma } from '@discord-bot-v2/prisma';

import { backlogItemSchema } from '../common-schema';
import { convertTs } from '../../utils/trpc/date-to-string';
import { TRPCError } from '@trpc/server';

const backlogItemData = Prisma.validator<Prisma.BacklogItemDefaultArgs>()({
  omit: {
    userId: true,
  },
  include: {
    backlogItemReview: {
      include: {
        cons: {
          omit: {
            backlogItemReviewId: true,
            id: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        pros: {
          omit: {
            backlogItemReviewId: true,
            id: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      omit: {
        backlogItemId: true,
        createdAt: true,
        updatedAt: true,
      },
    },
  },
});

type BacklogItemType = Prisma.BacklogItemGetPayload<typeof backlogItemData>;

const getBacklogItemByGameIdInput = z.object({
  gameId: z.number(),
  discordId: z.string(),
});

const getBacklogItemByGameIdOutput = z.object({
  backlogItem: backlogItemSchema,
});

export type GetBacklogItemByGameIdInputType = z.infer<
  typeof getBacklogItemByGameIdInput
>;
export type GetBacklogItemByGameIdOutputType = z.infer<
  typeof getBacklogItemByGameIdOutput
>;

export const getBacklogItemByGameIdProcedure = (t: TServer) => {
  return t.procedure
    .input(getBacklogItemByGameIdInput)
    .output(getBacklogItemByGameIdOutput)
    .query(async ({ input, ctx }) => {
      const user = await prisma.user.findUniqueOrThrow({
        where: { discordId: input.discordId },
      });
      const backlogItem = await prisma.backlogItem.findUnique({
        where: {
          userId_igdbGameId: {
            userId: user.id,
            igdbGameId: input.gameId,
          },
        },
        include: backlogItemData.include,
        omit: backlogItemData.omit,
      });

      if (!backlogItem) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "This backlog item doesn't exist",
        });
      }

      return {
        backlogItem: convertTs(backlogItem, [
          'abandonedAt',
          'createdAt',
          'finishedAt',
          'startedAt',
          'updatedAt',
        ]),
      };
    });
};
