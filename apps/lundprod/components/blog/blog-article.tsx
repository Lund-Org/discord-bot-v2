import {
  AspectRatio,
  Box,
  Flex,
  Heading,
  Image,
  Tag,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { BlogPost, Tag as BlogTag } from '@prisma/client';
import { formatBlogDate } from '~/lundprod/utils/dates';
import { getTitleFromFilename } from '~/lundprod/utils/blog';

type BlogArticleProps = {
  blogPost: BlogPost & {
    tags: BlogTag[];
  };
};

export const BlogArticle = ({ blogPost }: BlogArticleProps) => {
  const title = getTitleFromFilename(blogPost.filename);
  const postAt = new Date(blogPost.postAt);

  return (
    <Link href={`/blog/${blogPost.filename}`}>
      <Box
        className="blog-line"
        border="1px solid var(--chakra-colors-gray-900)"
        borderRadius={5}
        p="20px"
        transition="all .3s ease"
        _hover={{
          transform: 'scale(1.02)',
          bg: 'gray.700',
        }}
        boxShadow="md"
        position="relative"
        pb="40px"
        mb="30px"
      >
        <Box position="relative">
          <Heading
            as="h4"
            variant="h4"
            position="relative"
            zIndex={1}
            mb="15px"
          >
            {title}
          </Heading>
          <Box
            sx={{ '.blog-line:hover &': { width: '20px', bg: 'blue.700' } }}
            h="10px"
            w="200px"
            position="absolute"
            transition="width .3s ease, background .3s ease"
            bg="blue.600"
            bottom="5px"
            left="-3px"
            zIndex={0}
          />
        </Box>
        <Box alignItems="center" display={{ base: 'block', md: 'flex' }}>
          <AspectRatio maxW="200px" w="100%" ratio={6 / 4}>
            <Image src={blogPost.thumbnailUrl} alt={title} objectFit="cover" />
          </AspectRatio>
          <Text
            noOfLines={3}
            textOverflow="ellipsis"
            height="calc(1.5rem * 3)"
            mt={{ base: '20px', md: 0 }}
            ml={{ base: 0, md: '20px' }}
          >
            {blogPost.description}
          </Text>
        </Box>
        <Flex right={3} bottom={3} position="absolute" gap={2}>
          {blogPost.tags.map(({ id, name }) => (
            <Tag size="sm" colorScheme="blue" key={id}>
              {name}
            </Tag>
          ))}
          <Text color="orange.400" fontSize="12px">
            {formatBlogDate(postAt)}
          </Text>
        </Flex>
      </Box>
    </Link>
  );
};
