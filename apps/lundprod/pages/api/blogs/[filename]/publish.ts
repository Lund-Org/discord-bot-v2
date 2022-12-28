import { prisma } from '@discord-bot-v2/prisma';
import { BlogStatus } from 'prisma/prisma-client';
import { NextApiRequest, NextApiResponse } from 'next';
import { EmbedBuilder, WebhookClient } from 'discord.js';
import { getParam } from '../../../../utils/next';
import { getTitleFromFilename } from '../../../../utils/blog';

export default async function listBlogPosts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const filename = getParam(req.query.filename, '');
  const blogPost = await prisma.blogPost.findFirst({
    where: {
      filename,
      state: BlogStatus.NOT_PUBLISHED,
    },
  });

  console.log(blogPost);

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
