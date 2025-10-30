import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

import {
  backlogItemPrismaFields,
  backlogItemReviewsPrismaFields,
} from '~/lundprod/utils/api/backlog';
import { convertPrismaToBacklogItem } from '~/lundprod/utils/backlog';
import { getParam } from '~/lundprod/utils/next';

export default async function listBacklogItems(
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

  const items = await prisma.backlogItem.findMany({
    select: {
      ...backlogItemPrismaFields,
      backlogItemReview: {
        select: {
          ...backlogItemReviewsPrismaFields,
          pros: { select: { value: true } },
          cons: { select: { value: true } },
        },
      },
    },
    where: { userId: user.id },
    orderBy: { order: 'asc' },
  });

  const backlogItems = items.map(convertPrismaToBacklogItem);

  res.json({ backlogItems });
}
