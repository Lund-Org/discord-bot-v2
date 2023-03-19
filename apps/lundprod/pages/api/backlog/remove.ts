import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { getUserProfileUrl } from '~/lundprod/utils/url';

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
  const item = await prisma.backlogItem.findUnique({
    where: {
      userId_igdbGameId: {
        userId: user.id,
        igdbGameId: req.body.id,
      },
    },
  });

  if (!user || !item) {
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

  res.revalidate(getUserProfileUrl(session.userId));

  res.json({ success: true });
}
