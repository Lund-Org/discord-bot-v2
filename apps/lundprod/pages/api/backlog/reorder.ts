import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { getUserProfileUrl } from '~/lundprod/utils/url';
import { number, object } from 'yup';

const reorderBacklogSchema = object({
  oldOrder: number().min(1).required().positive().integer(),
  newOrder: number().min(1).required().positive().integer(),
  igdbId: number().required().positive().integer(),
});

export default async function reorderBacklog(
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

  const payload = await reorderBacklogSchema.validate(req.body);

  const existingBiggestOrder = await prisma.backlogItem.findFirst({
    where: { userId: user.id },
    orderBy: { order: 'desc' },
  });

  if (
    payload.oldOrder <= existingBiggestOrder.order &&
    payload.newOrder <= existingBiggestOrder.order &&
    payload.oldOrder !== payload.newOrder
  ) {
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
