import { Text } from '@chakra-ui/react';
import { BlogPost, Tag as TagType } from '@discord-bot-v2/prisma';

import { formatBlogDate } from '~/lundprod/utils/dates';

type BlogFooterProps = {
  blogPost: BlogPost & { tags: TagType[] };
};

export const BlogFooter = ({ blogPost }: BlogFooterProps) => (
  <Text textAlign="right" fontSize="14px" fontStyle="italic" py="20px">
    {formatBlogDate(new Date(blogPost.postAt))}
  </Text>
);
