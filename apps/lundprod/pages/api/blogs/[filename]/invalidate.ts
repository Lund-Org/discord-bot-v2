import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

import { getParam } from '~/lundprod/utils/next';

export default async function invalidateBlogPosts(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const filename = getParam(req.query.filename, '');
  const blogPost = await prisma.blogPost.findFirst({
    where: {
      filename,
    },
  });

  if (!blogPost) {
    return res.status(404).json({ success: false });
  }

  res.revalidate(`/blog/${filename}`);

  res.json({
    success: true,
  });
}
