import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { getUserProfileUrl } from '~/lundprod/utils/url';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import { BacklogItem, BacklogStatus, User } from '@prisma/client';

export default async function updateBacklogDetails(
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

  const backlogItem = await prisma.backlogItem.update({
    where: {
      userId_igdbGameId: {
        userId: user.id,
        igdbGameId: req.body.igdbGameId,
      },
    },
    data: {
      reason: req.body.reason,
      rating: req.body.rating,
    },
  });

  res.revalidate(getUserProfileUrl(session.userId));
  webhookNotification(user, backlogItem);

  res.json({ success: true });
}

function webhookNotification(user: User, backlogItem: BacklogItem) {
  const colorMapping = {
    [BacklogStatus.ABANDONED]: 0xcc3333,
    [BacklogStatus.FINISHED]: 0x33cc33,
  };
  const webhookClient = new WebhookClient({
    url: process.env.BACKLOG_WEBHOOK,
  });

  const embed = new EmbedBuilder()
    .setTitle('Mise à jour du backlog')
    .setColor(colorMapping[backlogItem.status]);

  embed.addFields({ name: 'Utilisateur', value: user.username });
  embed.addFields({ name: 'Titre', value: backlogItem.name });
  embed.addFields({ name: 'Note', value: `${backlogItem.rating}/5` });
  embed.addFields({ name: 'Commentaire', value: backlogItem.reason });
  embed.addFields({
    name: 'URL du profil',
    value: `${process.env.WEBSITE_URL}${getUserProfileUrl(user.discordId)}`,
  });

  webhookClient.send({
    username: 'BacklogBot',
    embeds: [embed],
  });
}
