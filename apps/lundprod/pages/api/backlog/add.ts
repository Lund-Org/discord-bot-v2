import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { getUserProfileUrl } from '~/lundprod/utils/url';

export default async function addToBacklog(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

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

  await prisma.backlogItem.upsert({
    where: {
      userId_igdbGameId: {
        userId: user.id,
        igdbGameId: req.body.igdbGameId,
      },
    },
    create: {
      igdbGameId: req.body.igdbGameId,
      name: req.body.name,
      category: req.body.category,
      url: req.body.url,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
    update: {},
  });

  res.revalidate(getUserProfileUrl(session.userId));

  res.json({ success: true });
}
