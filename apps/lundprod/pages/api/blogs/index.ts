import { Category } from 'prisma/prisma-client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getManyBlogPosts } from '../../../utils/api/blog';
import { getParam } from '../../../utils/next';

export default async function listBlogPosts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const page = parseInt(getParam(req.query.page, '1'), 10);
  const categories =
    typeof req.query.category === 'string'
      ? [req.query.category]
      : req.query.category || [];

  const blogPosts = await getManyBlogPosts({
    page,
    categories: categories as Category[],
  });

  res.json({
    blogPosts: JSON.parse(JSON.stringify(blogPosts)),
  });
}
