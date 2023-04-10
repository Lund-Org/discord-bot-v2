import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { number, object } from 'yup';

import { getUserListUrl, getUserProfileUrl } from '~/lundprod/utils/url';

import { authOptions } from '../auth/[...nextauth]';

const removeExpectedGameSchema = object({
  igdbGameId: number().required().positive().integer(),
});

export default async function removeExpectedGame(
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

  const payload = await removeExpectedGameSchema.validate(req.body);

  const expectedGame = await prisma.expectedGame.findFirstOrThrow({
    where: {
      igdbId: payload.igdbGameId,
    },
  });

  await prisma.expectedGame.delete({
    where: { id: expectedGame.id },
  });

  res.revalidate(getUserListUrl());
  res.revalidate(getUserProfileUrl(session.userId));

  res.json({ success: true });
}
