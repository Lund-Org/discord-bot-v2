import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

import { backlogItemPrismaFields } from '~/lundprod/utils/api/backlog';
import { getParam } from '~/lundprod/utils/next';

export default async function listBacklogItems(
  req: NextApiRequest,
  res: NextApiResponse
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

  const backlogItems = await prisma.backlogItem.findMany({
    select: backlogItemPrismaFields,
    where: { userId: user.id },
    orderBy: { order: 'desc' },
  });

  res.json({ backlogItems });
}
