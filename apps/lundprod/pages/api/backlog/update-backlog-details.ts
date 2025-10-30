import { prisma } from '@discord-bot-v2/prisma';
import { BacklogItem, BacklogStatus, Prisma, User } from '@prisma/client';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { array, boolean, number, object, string } from 'yup';

import { getUserProfileUrl } from '~/lundprod/utils/url';

import { authOptions } from '../auth/[...nextauth]';
import { omit } from 'lodash';

const updateBacklogDetailsSchema = object({
  igdbGameId: number().required().positive().integer(),
  review: string().required(),
  rating: number().min(1).max(5).required().integer(),
  duration: number().integer(),
  completion: number().min(0).max(100).integer(),
  completionComment: string().max(255),
  pros: array().of(string().max(255)),
  cons: array().of(string().max(255)),
  shouldNotify: boolean(),
});

const backlogItemValidator = Prisma.validator<Prisma.BacklogItemDefaultArgs>()({
  include: {
    backlogItemReview: {
      include: { pros: true, cons: true },
    },
  },
});

type BacklogItemType = Prisma.BacklogItemGetPayload<
  typeof backlogItemValidator
>;

export default async function updateBacklogDetails(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ success: false });
  }

  const user = await prisma.user.findFirst({
    where: {
      discordId: session.userId,
      isActive: true,
    },
  });

  if (!user) {
    return res.status(404).json({ success: false });
  }
  const payload = await updateBacklogDetailsSchema.validate(req.body);

  const { id } = await prisma.backlogItem.findUniqueOrThrow({
    where: {
      userId_igdbGameId: {
        userId: user.id,
        igdbGameId: payload.igdbGameId,
      },
    },
  });

  const data = {
    review: payload.review,
    completion: payload.completion,
    completionComment: payload.completionComment,
    rating: payload.rating,
    duration: payload.duration,
    backlogItemId: id,
    pros: {
      createMany: {
        data: payload.pros.map((value) => ({ value })),
      },
    },
    cons: {
      createMany: {
        data: payload.cons.map((value) => ({ value })),
      },
    },
  };

  await prisma.$transaction([
    prisma.backlogItemReviewPros.deleteMany({
      where: {
        backlogItemReview: {
          backlogItem: {
            id,
          },
        },
      },
    }),
    prisma.backlogItemReviewCons.deleteMany({
      where: {
        backlogItemReview: {
          backlogItem: {
            id,
          },
        },
      },
    }),
    prisma.backlogItemReview.upsert({
      where: {
        backlogItemId: id,
      },
      create: data,
      update: omit(data, 'backlogItemId'),
    }),
  ]);

  const backlogItem = await prisma.backlogItem.findUniqueOrThrow({
    where: { id },
    include: backlogItemValidator.include,
  });

  res.revalidate(getUserProfileUrl(session.userId));

  if (payload.shouldNotify) {
    webhookNotification(user, backlogItem as BacklogItemType);
  }

  res.json({ success: true });
}

function webhookNotification(user: User, backlogItem: BacklogItemType) {
  const colorMapping = {
    [BacklogStatus.ABANDONED]: 0xcc3333,
    [BacklogStatus.FINISHED]: 0x33cc33,
  };
  const webhookClient = new WebhookClient({
    url: process.env.BACKLOG_WEBHOOK,
  });
  const url = `${process.env.WEBSITE_URL}${getUserProfileUrl(
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
      backlogItem.backlogItemReview.review.length > 255
        ? `${backlogItem.backlogItemReview.review.substring(0, 252)}...`
        : backlogItem.backlogItemReview.review,
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
