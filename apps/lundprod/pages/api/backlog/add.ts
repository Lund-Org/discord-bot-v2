import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function listGames(
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

  await prisma.backlogItem.upsert({
    where: {
      playerId_igdbGameId: {
        playerId: player.id,
        igdbGameId: req.body.igdbGameId,
      },
    },
    create: {
      igdbGameId: req.body.igdbGameId,
      name: req.body.name,
      category: req.body.category,
      url: req.body.url,
      player: {
        connect: {
          id: player.id,
        },
      },
    },
    update: {},
  });

  res.json({ success: true });
}
