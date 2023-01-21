import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { getUserProfileUrl } from '~/lundprod/utils/url';

export default async function removeFromBacklog(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ success: false });
  }

  const player = await prisma.player.findUnique({
    where: {
      discordId: session.userId,
    },
  });

  if (!player) {
    return res.status(404).json({ success: false });
  }

  await prisma.backlogItem.deleteMany({
    where: {
      playerId: player.id,
      igdbGameId: req.body.id,
    },
  });

  res.revalidate(getUserProfileUrl(session.userId));

  res.json({ success: true });
}
