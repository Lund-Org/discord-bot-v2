import { prisma } from '@discord-bot-v2/prisma';
import { BacklogStatus } from '@prisma/client';
import z from 'zod';

import { getAuthedProcedure } from '../middleware';
import { BacklogItemMoveType, TServer } from '../types';

const moveBacklogItemInput = z.object({
  itemId: z.number(),
  direction: z.nativeEnum(BacklogItemMoveType),
  status: z.nativeEnum(BacklogStatus),
});
const moveBacklogItemOutput = z.object({
  success: z.boolean(),
});

export type MoveBacklogItemInputType = z.infer<typeof moveBacklogItemInput>;
export type MoveBacklogItemOutputType = z.infer<typeof moveBacklogItemOutput>;

export const moveBacklogItemProcedureProcedure = (t: TServer) => {
  return getAuthedProcedure(t)
    .input(moveBacklogItemInput)
    .output(moveBacklogItemOutput)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;

      const user = await prisma.user.findUniqueOrThrow({
        where: { discordId: session.userId },
      });

      await prisma.$transaction(async (t) => {
        const item = await t.backlogItem.findUniqueOrThrow({
          where: {
            id: input.itemId,
            status: input.status,
            userId: user.id,
          },
        });

        await t.backlogItem.updateMany({
          where: {
            order:
              input.direction === BacklogItemMoveType.DOWN
                ? item.order + 1
                : item.order - 1,
          },
          data: {
            order:
              input.direction === BacklogItemMoveType.DOWN
                ? { decrement: 1 }
                : { increment: 1 },
          },
        });
        await t.backlogItem.update({
          where: { id: item.id },
          data: {
            order:
              input.direction === BacklogItemMoveType.DOWN
                ? { increment: 1 }
                : { decrement: 1 },
          },
        });
      });

      return {
        success: true,
      };
    });
};
