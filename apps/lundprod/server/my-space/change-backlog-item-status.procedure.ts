import { prisma } from '@discord-bot-v2/prisma';
import { BacklogItem, BacklogStatus, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import z from 'zod';

import { getUserProfileUrl } from '~/lundprod/utils/url';

import { TServer } from '../types';
import { getAuthedProcedure } from '../middleware';
import { backlogItemSchema } from '../common-schema';
import { convertTs } from '../../utils/trpc/date-to-string';

const changeBacklogItemStatusInput = z.object({
  itemId: z.number(),
  notifyOnDiscord: z.boolean(),
  status: z.nativeEnum(BacklogStatus),
});
const changeBacklogItemStatusOutput = z.object({
  newBacklogItem: backlogItemSchema,
});

export type ChangeBacklogItemStatusInputType = z.infer<
  typeof changeBacklogItemStatusInput
>;
export type ChangeBacklogItemStatusOutputType = z.infer<
  typeof changeBacklogItemStatusOutput
>;

export const changeBacklogItemStatusProcedure = (t: TServer) => {
  return getAuthedProcedure(t)
    .input(changeBacklogItemStatusInput)
    .output(changeBacklogItemStatusOutput)
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

      const newBacklogItem = await prisma.$transaction(async (t) => {
        // Get last item of dest status to calculate the new order value
        const lastItemNewStatus = await t.backlogItem.findFirst({
          where: {
            userId: user.id,
            status: input.status,
          },
          select: { order: true },
          orderBy: { order: 'desc' },
        });

        // Update the status & order of the item to change
        const newBacklogItem = await t.backlogItem.update({
          where: { id: backlogItem.id },
          data: {
            status: input.status,
            order: (lastItemNewStatus?.order || 0) + 1,
            ...(input.status === BacklogStatus.BACKLOG
              ? {
                  createdAt: new Date(),
                }
              : input.status === BacklogStatus.CURRENTLY
                ? {
                    startedAt: new Date(),
                  }
                : input.status === BacklogStatus.ABANDONED
                  ? {
                      abandonedAt: new Date(),
                    }
                  : input.status === BacklogStatus.FINISHED
                    ? {
                        finishedAt: new Date(),
                      }
                    : {
                        wishlistAt: new Date(),
                      }),
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

        // Move the following items of the previous status now there is a "hole" in the list
        await t.backlogItem.updateMany({
          where: {
            userId: user.id,
            status: backlogItem.status,
            order: { gte: backlogItem.order },
          },
          data: {
            order: { decrement: 1 },
          },
        });

        return newBacklogItem;
      });

      if (input.notifyOnDiscord) {
        webhookNotification(user, newBacklogItem);
      }

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

function webhookNotification(user: User, backlogItem: BacklogItem) {
  const wordingMapping = {
    [BacklogStatus.ABANDONED]: 'A abandonné le jeu',
    [BacklogStatus.FINISHED]: 'A fini le jeu',
    [BacklogStatus.BACKLOG]: 'A remis le jeu dans son backlog',
    [BacklogStatus.CURRENTLY]: 'A commencé le jeu',
    [BacklogStatus.WISHLIST]: 'A wishlist le jeu',
  };
  const webhookClient = new WebhookClient({
    url: process.env.BACKLOG_WEBHOOK || '',
  });

  const embed = new EmbedBuilder()
    .setTitle('Mise à jour du backlog')
    .setColor(0xfcba03);

  embed.addFields({ name: 'Utilisateur', value: user.username });
  embed.addFields({ name: 'Titre', value: backlogItem.name });
  embed.addFields({
    name: 'Statut',
    value: wordingMapping[backlogItem.status],
  });
  embed.addFields({
    name: 'URL du profil',
    value: `${process.env.WEBSITE_URL}${getUserProfileUrl(user.discordId)}`,
  });

  webhookClient.send({
    username: 'BacklogBot',
    embeds: [embed],
  });
}
