import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { number, object } from 'yup';

import { getUserListUrl, getUserProfileUrl } from '~/lundprod/utils/url';

import { authOptions } from '../auth/[...nextauth]';

const removeFromBacklogSchema = object({
  id: number().required().positive().integer(),
});

export default async function removeFromBacklog(
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

  const payload = await removeFromBacklogSchema.validate(req.body);

  const item = await prisma.backlogItem.findUnique({
    where: {
      userId_igdbGameId: {
        userId: user.id,
        igdbGameId: payload.id,
      },
    },
  });

  if (!item) {
    return res.status(404).json({ success: false });
  }

  await prisma.$transaction([
    prisma.backlogItem.delete({
      where: {
        id: item.id,
      },
    }),
    prisma.backlogItem.updateMany({
      where: {
        userId: user.id,
        order: { gt: item.order },
      },
      data: {
        order: {
          increment: -1,
        },
      },
    }),
  ]);

  res.revalidate(getUserListUrl());
  res.revalidate(getUserProfileUrl(session.userId));

  res.json({ success: true });
}
