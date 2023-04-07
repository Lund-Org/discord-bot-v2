import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

import { expectedGamesPrismaSelect } from '~/lundprod/utils/api/expected-games';
import { getParam } from '~/lundprod/utils/next';

export default async function listExpectedGame(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const discordId = getParam(req.query.discordId);

  const user = await prisma.user.findFirst({
    where: {
      discordId,
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
