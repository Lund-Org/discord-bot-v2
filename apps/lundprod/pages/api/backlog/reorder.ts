import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { getUserProfileUrl } from '~/lundprod/utils/url';

export default async function addToBacklog(
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

  const payload = req.body;

  const existingBiggestOrder = await prisma.backlogItem.findFirst({
    where: { userId: user.id },
    orderBy: { order: 'desc' },
  });

  if (!validateReorder(payload, existingBiggestOrder.order)) {
    return res.status(400).json({ success: false });
  }

  const orderCondition =
    payload.oldOrder < payload.newOrder
      ? {
          // Move everything down and set the moved object to the new order
          gte: payload.oldOrder,
          lte: payload.newOrder,
        }
      : {
          // Move everything up and set the moved object to the new order
          lte: payload.oldOrder,
          gte: payload.newOrder,
        };
  const increment = payload.oldOrder < payload.newOrder ? -1 : 1;

  await prisma.$transaction([
    prisma.backlogItem.updateMany({
      where: {
        userId: user.id,
        order: orderCondition,
      },
      data: {
        order: {
          increment,
        },
      },
    }),
    prisma.backlogItem.update({
      where: {
        userId_igdbGameId: {
          igdbGameId: payload.igdbId,
          userId: user.id,
        },
      },
      data: {
        order: payload.newOrder,
      },
    }),
  ]);

  res.revalidate(getUserProfileUrl(session.userId));

  res.json({ success: true });
}

function validateReorder(
  data: unknown,
  maxOrder: number
): data is { oldOrder: number; newOrder: number; igdbId: number } {
  return !!(
    typeof data === 'object' &&
    'oldOrder' in data &&
    'newOrder' in data &&
    'igdbId' in data &&
    typeof data.oldOrder === 'number' &&
    typeof data.newOrder === 'number' &&
    typeof data.igdbId === 'number' &&
    data.oldOrder !== data.newOrder &&
    data.oldOrder >= 1 &&
    data.oldOrder <= maxOrder &&
    data.newOrder >= 1 &&
    data.newOrder <= maxOrder
  );
}
