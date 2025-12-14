import { prisma } from '@discord-bot-v2/prisma';
import z from 'zod';

import { getAuthedProcedure } from '../middleware';
import { TServer } from '../types';

const moveBacklogItemToPositionInput = z.object({
  itemId: z.number(),
  newPosition: z.number(),
});
const moveBacklogItemToPositionOutput = z.object({
  success: z.boolean(),
});

export type MoveBacklogItemToPositionInputType = z.infer<
  typeof moveBacklogItemToPositionInput
>;
export type MoveBacklogItemToPositionOutputType = z.infer<
  typeof moveBacklogItemToPositionOutput
>;

export const moveBacklogItemToPositionProcedure = (t: TServer) => {
  return getAuthedProcedure(t)
    .input(moveBacklogItemToPositionInput)
    .output(moveBacklogItemToPositionOutput)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;

      const user = await prisma.user.findUniqueOrThrow({
        where: { discordId: session.userId },
      });

      await prisma.$transaction(async (t) => {
        const item = await t.backlogItem.findUniqueOrThrow({
          where: {
            id: input.itemId,
            userId: user.id,
          },
        });
        const maxPosition = await t.backlogItem.count({
          where: {
            status: item.status,
            userId: user.id,
          },
        });

        await t.backlogItem.updateMany({
          where: {
            order:
              item.order < input.newPosition
                ? {
                    gte: item.order,
                    lte: input.newPosition,
                  }
                : {
                    lte: item.order,
                    gte: input.newPosition,
                  },
          },
          data: {
            order:
              item.order < input.newPosition
                ? { decrement: 1 }
                : { increment: 1 },
          },
        });
        await t.backlogItem.update({
          where: { id: item.id },
          data: {
            order: Math.max(Math.min(input.newPosition, maxPosition), 1),
          },
        });
      });

      return {
        success: true,
      };
    });
};
