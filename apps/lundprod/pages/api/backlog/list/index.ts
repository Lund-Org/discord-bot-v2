import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import { backlogItemPrismaFields } from '~/lundprod/utils/api/backlog';

import { authOptions } from '../../auth/[...nextauth]';

export default async function listOwnBacklogItems(
  req: NextApiRequest,
  res: NextApiResponse
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

  const backlogItems = await prisma.backlogItem.findMany({
    select: backlogItemPrismaFields,
    where: { userId: user.id },
    orderBy: { order: 'asc' },
  });

  res.json({ backlogItems });
}
