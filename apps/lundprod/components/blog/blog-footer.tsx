import { Text } from '@chakra-ui/react';
import { formatBlogDate } from '../../utils/dates';
import { BlogPost, Tag as TagType } from '@prisma/client';

type BlogFooterProps = {
  blogPost: BlogPost & { tags: TagType[] };
};

export const BlogFooter = ({ blogPost }: BlogFooterProps) => (
  <Text textAlign="right" fontSize="14px" fontStyle="italic" py="20px">
    {formatBlogDate(new Date(blogPost.postAt))}
  </Text>
);
