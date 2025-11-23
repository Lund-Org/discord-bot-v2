import { prisma } from '@discord-bot-v2/prisma';
import z from 'zod';

import { TServer } from '../types';
import { getAuthedProcedure } from '../middleware';
import { TRPCError } from '@trpc/server';

const toggleExpectedGameBacklogInput = z.object({
  id: z.number(),
});
const toggleExpectedGameBacklogOutput = z.object({
  success: z.boolean(),
});

export type ToggleExpectedGameBacklogInputType = z.infer<
  typeof toggleExpectedGameBacklogInput
>;
export type ToggleExpectedGameBacklogOutputType = z.infer<
  typeof toggleExpectedGameBacklogOutput
>;

export const toggleExpectedGameBacklogProcedure = (t: TServer) => {
  return getAuthedProcedure(t)
    .input(toggleExpectedGameBacklogInput)
    .output(toggleExpectedGameBacklogOutput)
    .mutation(async ({ input, ctx }) => {
      const { session } = ctx;

      const user = await prisma.user.findUniqueOrThrow({
        where: { discordId: session.userId },
      });

      const expectedGame = await prisma.expectedGame.findUnique({
        where: {
          id: input.id,
          userId: user.id,
        },
      });

      if (!expectedGame) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "This expected game doesn't exist",
        });
      }

      await prisma.expectedGame.update({
        where: { id: expectedGame.id },
        data: { addToBacklog: !expectedGame.addToBacklog },
      });

      return {
        success: true,
      };
    });
};
