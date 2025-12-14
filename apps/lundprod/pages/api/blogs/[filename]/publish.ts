import { prisma } from '@discord-bot-v2/prisma';
import { BlogStatus } from '@prisma/client';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import { NextApiRequest, NextApiResponse } from 'next';

import { getTitleFromFilename } from '~/lundprod/utils/blog';
import { getParam } from '~/lundprod/utils/next';

export default async function publishBlogPosts(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const filename = getParam(req.query.filename, '');
  const blogPost = await prisma.blogPost.findFirst({
    where: {
      filename,
      state: BlogStatus.NOT_PUBLISHED,
    },
  });

  if (!blogPost) {
    return res.status(404).json({ success: false });
  }

  await prisma.blogPost.update({
    where: {
      filename,
    },
    data: {
      state: BlogStatus.PUBLISHED,
    },
  });
  const webhookClient = new WebhookClient({
    url: process.env.BLOGPOST_WEBHOOK,
  });

  const embed = new EmbedBuilder()
    .setTitle('Nouveau blog post')
    .setColor(0x00ffff)
    .setThumbnail(blogPost.thumbnailUrl);

  embed.addFields({ name: 'Titre', value: getTitleFromFilename(filename) });
  embed.addFields({
    name: 'URL',
    value: `${process.env.WEBSITE_URL}/blog/${filename}`,
  });

  webhookClient.send({
    username: 'BlogBot',
    embeds: [embed],
  });

  res.json({
    success: true,
  });
}
