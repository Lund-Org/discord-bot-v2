import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { boolean, number, object } from 'yup';

import { getUserProfileUrl } from '~/lundprod/utils/url';

import { authOptions } from '../auth/[...nextauth]';

const updateExpectedGameSchema = object({
  igdbGameId: number().required().positive().integer(),
  data: object({
    addToBacklog: boolean().required(),
  }).required(),
});

export default async function addExpectedGame(
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

  const payload = await updateExpectedGameSchema.validate(req.body);

  await prisma.expectedGame.update({
    where: {
      igdbId_userId: {
        igdbId: payload.igdbGameId,
        userId: user.id,
      },
    },
    data: {
      addToBacklog: payload.data.addToBacklog,
    },
  });

  res.revalidate(getUserProfileUrl(session.userId));

  res.json({ success: true });
}
