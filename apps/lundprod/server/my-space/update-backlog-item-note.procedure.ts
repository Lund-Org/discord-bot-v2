import { prisma } from '@discord-bot-v2/prisma';
import { BacklogItem, BacklogStatus, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import z from 'zod';

import { getUserProfileUrl } from '~/lundprod/utils/url';

import { TServer } from '../types';
import { getAuthedProcedure } from '../middleware';
import { backlogItemSchema } from '../common-schema';
import { MAX_NOTE_SIZE } from '../types';
import { convertTs } from '../../utils/trpc/date-to-string';

const updateBacklogItemNoteInput = z.object({
  itemId: z.number(),
  note: z.string().max(MAX_NOTE_SIZE),
});
const updateBacklogItemNoteOutput = z.object({
  newBacklogItem: backlogItemSchema,
});

export type UpdateBacklogItemNoteInputType = z.infer<
  typeof updateBacklogItemNoteInput
>;
export type UpdateBacklogItemNoteOutputType = z.infer<
  typeof updateBacklogItemNoteOutput
>;

export const updateBacklogItemNoteProcedure = (t: TServer) => {
  return getAuthedProcedure(t)
    .input(updateBacklogItemNoteInput)
    .output(updateBacklogItemNoteOutput)
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

      // Move the following items of the previous status now there is a "hole" in the list
      const newBacklogItem = await prisma.backlogItem.update({
        where: {
          id: backlogItem.id,
        },
        data: {
          note: input.note,
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

      return {
        newBacklogItem: convertTs(newBacklogItem, [
          'abandonedAt',
          'createdAt',
          'finishedAt',
          'startedAt',
          'updatedAt',
        ]),
      };
    });
};
