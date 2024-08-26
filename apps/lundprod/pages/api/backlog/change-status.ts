import { prisma } from '@discord-bot-v2/prisma';
import { BacklogItem, BacklogStatus, User } from '@prisma/client';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { number, object, string } from 'yup';

import { getUserProfileUrl } from '~/lundprod/utils/url';

import { authOptions } from '../auth/[...nextauth]';

const changeBacklogStatusSchema = object({
  igdbGameId: number().required().positive().integer(),
  status: string().oneOf(Object.values(BacklogStatus)).required(),
});

export default async function changeBacklogStatus(
  req: NextApiRequest,
  res: NextApiResponse,
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

  const payload = await changeBacklogStatusSchema.validate(req.body);

  const backlogItem = await prisma.backlogItem.update({
    where: {
      userId_igdbGameId: {
        userId: user.id,
        igdbGameId: payload.igdbGameId,
      },
    },
    data: {
      status: payload.status,
    },
  });

  res.revalidate(getUserProfileUrl(session.userId));

  if (payload.status !== BacklogStatus.WISHLIST) {
    webhookNotification(user, backlogItem);
  }

  res.json({ success: true });
}

function webhookNotification(user: User, backlogItem: BacklogItem) {
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

  embed.addFields({ name: 'Utilisateur', value: user.username });
  embed.addFields({ name: 'Titre', value: backlogItem.name });
  embed.addFields({
    name: 'Statut',
    value: wordingMapping[backlogItem.status],
  });
  embed.addFields({
    name: 'URL du profil',
    value: `${process.env.WEBSITE_URL}${getUserProfileUrl(user.discordId)}`,
  });

  webhookClient.send({
    username: 'BacklogBot',
    embeds: [embed],
  });
}
