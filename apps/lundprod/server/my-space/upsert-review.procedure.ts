import { prisma } from '@discord-bot-v2/prisma';
import { BacklogStatus, Prisma, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import { omit } from 'lodash';
import z from 'zod';

import { getUserProfileUrl } from '~/lundprod/utils/url';

import { convertTs } from '../../utils/trpc/date-to-string';
import { backlogItemSchema } from '../common-schema';
import { getAuthedProcedure } from '../middleware';
import { TServer } from '../types';

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

const upsertReviewInput = z.object({
  itemId: z.number(),
  rating: z.number().min(1).max(5).int(),
  duration: z.number().int().min(1),
  completion: z.number().int().min(1).max(100),
  completionComment: z.string().max(255).optional(),
  review: z.string(),
  pros: z.array(z.string().max(255)),
  cons: z.array(z.string().max(255)),
  shouldNotify: z.boolean(),
});
const upsertReviewOutput = z.object({
  newBacklogItem: backlogItemSchema,
});

export type UpsertReviewInputType = z.infer<typeof upsertReviewInput>;
export type UpsertReviewOutputType = z.infer<typeof upsertReviewOutput>;

export const upsertReviewProcedure = (t: TServer) => {
  return getAuthedProcedure(t)
    .input(upsertReviewInput)
    .output(upsertReviewOutput)
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

      const data = {
        review: input.review,
        completion: input.completion,
        completionComment: input.completionComment,
        rating: input.rating,
        duration: input.duration,
        backlogItemId: backlogItem.id,
        pros: {
          createMany: {
            data: input.pros.map((value) => ({ value })),
          },
        },
        cons: {
          createMany: {
            data: input.cons.map((value) => ({ value })),
          },
        },
      };

      await prisma.$transaction([
        prisma.backlogItemReviewPros.deleteMany({
          where: {
            backlogItemReview: {
              backlogItem: {
                id: backlogItem.id,
              },
            },
          },
        }),
        prisma.backlogItemReviewCons.deleteMany({
          where: {
            backlogItemReview: {
              backlogItem: {
                id: backlogItem.id,
              },
            },
          },
        }),
        prisma.backlogItemReview.upsert({
          where: {
            backlogItemId: backlogItem.id,
          },
          create: data,
          update: omit(data, 'backlogItemId'),
        }),
      ]);

      const newBacklogItem = await prisma.backlogItem.findUniqueOrThrow({
        where: { id: backlogItem.id },
        include: {
          backlogItemReview: {
            include: {
              cons: true,
              pros: true,
            },
          },
        },
      });

      if (input.shouldNotify) {
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

function webhookNotification(user: User, backlogItem: BacklogItemType) {
  if (!backlogItem.backlogItemReview) {
    return;
  }

  const colorMapping: Record<BacklogStatus, number> = {
    [BacklogStatus.ABANDONED]: 0xcc3333,
    [BacklogStatus.FINISHED]: 0x33cc33,
    // should never be the case, use for typing
    [BacklogStatus.BACKLOG]: 0,
    [BacklogStatus.CURRENTLY]: 0,
    [BacklogStatus.WISHLIST]: 0,
  };
  const webhookClient = new WebhookClient({
    url: process.env.BACKLOG_WEBHOOK || '',
  });
  const url = `${process.env.NEXT_PUBLIC_WEBSITE_URL}${getUserProfileUrl(
    user.discordId,
  )}?igdbGameId=${backlogItem.igdbGameId}`;
  const embed = new EmbedBuilder()
    .setTitle('Mise à jour du backlog')
    .setColor(colorMapping[backlogItem.status]);

  embed.setURL(url);

  embed.addFields({ name: 'Utilisateur', value: user.username, inline: true });
  embed.addFields({ name: 'Titre', value: backlogItem.name, inline: true });
  embed.addFields({ name: ' ', value: ' ' });
  embed.addFields({
    name: 'Note',
    value: `${backlogItem.backlogItemReview.rating}/5`,
    inline: true,
  });
  embed.addFields({
    name: 'Durée',
    value: `${backlogItem.backlogItemReview.duration}h`,
    inline: true,
  });
  embed.addFields({ name: ' ', value: ' ' });
  embed.addFields({
    name: 'Complétion',
    value: `${backlogItem.backlogItemReview.completion}%`,
    inline: !!backlogItem.backlogItemReview.completionComment,
  });
  if (backlogItem.backlogItemReview.completionComment) {
    embed.addFields({
      name: 'Remarque sur la complétion',
      value: backlogItem.backlogItemReview.completionComment,
      inline: true,
    });
  }
  embed.addFields({
    name: 'Commentaire',
    value:
      backlogItem.backlogItemReview.review &&
      backlogItem.backlogItemReview.review.length > 255
        ? `${backlogItem.backlogItemReview.review.substring(0, 252)}...`
        : backlogItem.backlogItemReview.review || '',
  });
  embed.addFields({
    name: 'Points positifs',
    value: backlogItem.backlogItemReview.pros
      .map(({ value }) => value)
      .join('\n\n')
      .substring(0, 4096),
    inline: true,
  });
  embed.addFields({
    name: 'Points négatifs',
    value: backlogItem.backlogItemReview.cons
      .map(({ value }) => value)
      .join('\n\n')
      .substring(0, 4096),
    inline: true,
  });
  embed.addFields({
    name: 'Lien vers la review',
    value: url,
  });

  webhookClient.send({
    username: 'BacklogBot',
    embeds: [embed],
  });
}
