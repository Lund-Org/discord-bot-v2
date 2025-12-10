import { prisma } from '@discord-bot-v2/prisma';
import { TRPCError } from '@trpc/server';
import z from 'zod';

import { getAuthedProcedure } from '../middleware';
import { TServer } from '../types';

const removeExpectedGameInput = z.object({
  id: z.number(),
});
const removeExpectedGameOutput = z.object({
  success: z.boolean(),
});

export type RemoveExpectedGameInputType = z.infer<
  typeof removeExpectedGameInput
>;
export type RemoveExpectedGameOutputType = z.infer<
  typeof removeExpectedGameOutput
>;

export const removeExpectedGameProcedure = (t: TServer) => {
  return getAuthedProcedure(t)
    .input(removeExpectedGameInput)
    .output(removeExpectedGameOutput)
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

      await prisma.expectedGame.delete({ where: { id: expectedGame.id } });

      return {
        success: true,
      };
    });
};
