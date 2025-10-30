import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

import {
  backlogItemPrismaFields,
  backlogItemReviewsPrismaFields,
} from '~/lundprod/utils/api/backlog';
import { convertPrismaToBacklogItem } from '~/lundprod/utils/backlog';
import { getParam } from '~/lundprod/utils/next';

export default async function getBacklogItemsForUser(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const discordId = getParam(req.query.discordId);

  const user = await prisma.user.findFirst({
    where: {
      discordId,
      isActive: true,
    },
  });

  if (!user) {
    return res.status(404).json({ success: false });
  }

  const select = {
    ...backlogItemPrismaFields,
    backlogItemReview: {
      select: {
        ...backlogItemReviewsPrismaFields,
        pros: { select: { value: true } },
        cons: { select: { value: true } },
      },
    },
  };

  const [backlog, currently, finished, abandoned, wishlisted] =
    await Promise.all([
      prisma.backlogItem.findMany({
        select,
        where: { userId: user.id, status: 'BACKLOG' },
        orderBy: { order: 'asc' },
      }),
      prisma.backlogItem.findMany({
        select,
        where: { userId: user.id, status: 'CURRENTLY' },
        orderBy: { order: 'asc' },
      }),
      prisma.backlogItem.findMany({
        select,
        where: { userId: user.id, status: 'FINISHED' },
        orderBy: { order: 'asc' },
      }),
      prisma.backlogItem.findMany({
        select,
        where: { userId: user.id, status: 'ABANDONED' },
        orderBy: { order: 'asc' },
      }),
      prisma.backlogItem.findMany({
        select,
        where: { userId: user.id, status: 'WISHLIST' },
        orderBy: { order: 'asc' },
      }),
    ]);

  res.json({ backlog, currently, finished, abandoned, wishlisted });
}
