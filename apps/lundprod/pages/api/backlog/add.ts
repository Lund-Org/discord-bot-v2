import { gameTypeMapping } from '@discord-bot-v2/igdb';
import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { number, object, string } from 'yup';

import { getUserProfileUrl } from '~/lundprod/utils/url';

import { authOptions } from '../auth/[...nextauth]';

const addToBacklogSchema = object({
  igdbGameId: number().required().positive().integer(),
  name: string().required(),
  category: string().oneOf(Object.values(gameTypeMapping)).required(),
  url: string().required(),
});

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

  const payload = await addToBacklogSchema.validate(req.body);

  const existingBiggestOrder = await prisma.backlogItem.findFirst({
    where: { userId: user.id },
    orderBy: { order: 'desc' },
  });
  await prisma.backlogItem.upsert({
    where: {
      userId_igdbGameId: {
        userId: user.id,
        igdbGameId: payload.igdbGameId,
      },
    },
    create: {
      igdbGameId: payload.igdbGameId,
      name: payload.name,
      category: payload.category,
      url: payload.url,
      user: {
        connect: {
          id: user.id,
        },
      },
      order: existingBiggestOrder.order + 1 || 1,
    },
    update: {},
  });

  res.revalidate(getUserProfileUrl(session.userId));

  res.json({ success: true });
}
