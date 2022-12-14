import { prisma } from '@discord-bot-v2/prisma';
import { getGachaProfileUrl, getGachaRankingPage } from '../../utils/url';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function refreshGachaProfile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.discordId) {
    return res
      .status(400)
      .send('Bad request, please retry with the right parameters');
  }

  const discordId = Array.isArray(req.query.discordId)
    ? req.query.discordId[0]
    : req.query.discordId || '';

  const player = prisma.player.findUnique({
    where: { discordId },
  });

  if (!player) {
    return res.status(404).send('Player not found');
  }

  Promise.all([
    res.revalidate(getGachaRankingPage()),
    res.revalidate(getGachaProfileUrl(discordId)),
  ]);

  res.json({ revalidate: true });
}
