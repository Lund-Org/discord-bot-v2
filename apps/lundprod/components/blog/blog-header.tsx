import { AspectRatio, Box, Heading, Image, Tag, Text } from '@chakra-ui/react';
import { BlogPost, Tag as TagType } from '@prisma/client';

import { ColoredSpacer } from './blog-helpers/colored-spacer';

type BlogHeaderProps = {
  title: string;
  blogPost: BlogPost & { tags: TagType[] };
};

export const BlogHeader = ({ title, blogPost }: BlogHeaderProps) => (
  <>
    <Box position="relative" textAlign="center">
      <AspectRatio w="100%" ratio={3}>
        <Image src={blogPost.bannerUrl} alt={title} objectFit="cover" />
      </AspectRatio>
      <Heading
        as="h1"
        variant="h1"
        color="orange.400"
        pb="10px"
        position="relative"
        zIndex={1}
      >
        {title}
      </Heading>
      <Box
        position="absolute"
        h="5px"
        w="75px"
        bg="blue.600"
        zIndex={0}
        left="50%"
        transform="translateX(-50%)"
        bottom="20px"
      />
    </Box>
    <Box w="80%" mx="auto" mt="50px" mb="30px">
      <Text>{blogPost.description}</Text>
    </Box>
    <Box textAlign="right" mb="20px">
      {blogPost.tags.map((tag) => (
        <Tag size="sm" colorScheme="blue" key={tag.id}>
          {tag.name}
        </Tag>
      ))}
    </Box>
    <ColoredSpacer mb="50px" />
  </>
);
