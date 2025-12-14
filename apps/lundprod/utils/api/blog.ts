import { prisma } from '@discord-bot-v2/prisma';
import { BlogStatus, Category } from '@prisma/client';

import { POST_PER_PAGE } from '../constants';

export const getManyBlogPosts = async ({
  state = BlogStatus.PUBLISHED,
  page,
  categories,
}: {
  state?: BlogStatus;
  page: number;
  categories: Category[];
}) => {
  return prisma.blogPost.findMany({
    where: {
      ...(categories.length && {
        category: {
          in: categories,
        },
      }),
      state,
    },
    skip: (page - 1) * POST_PER_PAGE,
    take: POST_PER_PAGE,
    include: { tags: true },
    orderBy: {
      postAt: 'desc',
    },
  });
};
