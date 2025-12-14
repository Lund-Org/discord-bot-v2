import { prisma } from '@discord-bot-v2/prisma';
import { TRPCError } from '@trpc/server';
import z from 'zod';

import { getAuthedProcedure } from '../middleware';
import { TServer } from '../types';

const removeBacklogItemInput = z.object({
  itemId: z.number(),
});
const removeBacklogItemOutput = z.object({
  success: z.boolean(),
});

export type RemoveBacklogItemInputType = z.infer<typeof removeBacklogItemInput>;
export type RemoveBacklogItemOutputType = z.infer<
  typeof removeBacklogItemOutput
>;

export const removeBacklogItemProcedure = (t: TServer) => {
  return getAuthedProcedure(t)
    .input(removeBacklogItemInput)
    .output(removeBacklogItemOutput)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;

      const user = await prisma.user.findUniqueOrThrow({
        where: { discordId: session.userId },
      });

      const backlogItem = await prisma.backlogItem.findUnique({
        where: {
          id: input.itemId,
          userId: user.id,
        },
      });

      if (!backlogItem) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "This backlog item doesn't exist",
        });
      }

      await prisma.backlogItem.delete({ where: { id: backlogItem.id } });
      await prisma.backlogItem.updateMany({
        where: {
          status: backlogItem.status,
          order: { gte: backlogItem.order },
        },
        data: {
          order: { decrement: 1 },
        },
      });

      return {
        success: true,
      };
    });
};
