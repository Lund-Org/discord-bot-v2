import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import { expectedGamesPrismaSelect } from '~/lundprod/utils/api/expected-games';

import { authOptions } from '../../auth/[...nextauth]';

export default async function listExpectedGame(
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

  const expectedGames = await prisma.expectedGame.findMany({
    select: expectedGamesPrismaSelect,
    where: { userId: user.id },
  });

  res.json({ expectedGames });
}
