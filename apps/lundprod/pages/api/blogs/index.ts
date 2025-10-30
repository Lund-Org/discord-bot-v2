import { NextApiRequest, NextApiResponse } from 'next';
import { Category } from '@prisma/client';

import { getManyBlogPosts } from '~/lundprod/utils/api/blog';
import { getNumberParam } from '~/lundprod/utils/next';

export default async function listBlogPosts(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const page = getNumberParam(req.query.page, 1);
  const categories =
    typeof req.query.category === 'string'
      ? [req.query.category]
      : req.query.category || [];

  const blogPosts = await getManyBlogPosts({
    page: page < 1 ? 1 : page,
    categories: categories as Category[],
  });

  res.json({
    blogPosts: JSON.parse(JSON.stringify(blogPosts)),
  });
}
