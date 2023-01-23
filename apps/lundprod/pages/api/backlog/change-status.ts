import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { getUserProfileUrl } from '~/lundprod/utils/url';
import { BacklogItem, BacklogStatus, Player } from '@prisma/client';
import { EmbedBuilder, WebhookClient } from 'discord.js';

export default async function changeBacklogStatus(
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

  const backlogItem = await prisma.backlogItem.update({
    where: {
      playerId_igdbGameId: {
        playerId: player.id,
        igdbGameId: req.body.igdbGameId,
      },
    },
    data: {
      status: req.body.status,
      reason: null,
      rating: 0,
    },
  });

  res.revalidate(getUserProfileUrl(session.userId));
  webhookNotification(player, backlogItem);

  res.json({ success: true });
}

function webhookNotification(player: Player, backlogItem: BacklogItem) {
  const wordingMapping = {
    [BacklogStatus.ABANDONED]: 'A abandonné le jeu',
    [BacklogStatus.FINISHED]: 'A fini le jeu',
    [BacklogStatus.BACKLOG]: 'A remis le jeu dans son backlog',
    [BacklogStatus.CURRENTLY]: 'A commencé le jeu',
  };
  const webhookClient = new WebhookClient({
    url: process.env.BACKLOG_WEBHOOK,
  });

  const embed = new EmbedBuilder()
    .setTitle('Mise à jour du backlog')
    .setColor(0xfcba03);

  embed.addFields({ name: 'Utilisateur', value: player.username });
  embed.addFields({ name: 'Titre', value: backlogItem.name });
  embed.addFields({
    name: 'Statut',
    value: wordingMapping[backlogItem.status],
  });
  embed.addFields({
    name: 'URL du profil',
    value: `${process.env.WEBSITE_URL}${getUserProfileUrl(player.discordId)}`,
  });

  webhookClient.send({
    username: 'BacklogBot',
    embeds: [embed],
  });
}
