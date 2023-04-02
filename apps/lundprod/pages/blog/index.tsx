import {
  Box,
  Checkbox,
  Flex,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { BlogPost, Category, Tag } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';

import { BlogArticle } from '~/lundprod/components/blog/blog-article';
import { useFetcher } from '~/lundprod/hooks/useFetcher';
import { getManyBlogPosts } from '~/lundprod/utils/api/blog';
import { CategoryWordingMapping } from '~/lundprod/utils/blog';
import { getNumberParam } from '~/lundprod/utils/next';

type PropsType = {
  blogPosts: (BlogPost & {
    tags: Tag[];
  })[];
};

export const getServerSideProps: GetServerSideProps<PropsType> = async ({
  query,
}) => {
  const page = getNumberParam(query.page, 1);
  const categories =
    typeof query.category === 'string'
      ? [query.category]
      : query.category || [];
  const blogPosts = await getManyBlogPosts({
    page: page <= 0 ? 1 : page,
    categories: categories as Category[],
  });

  return {
    props: {
      blogPosts: JSON.parse(JSON.stringify(blogPosts)),
    },
  };
};

export function BlogPage({ blogPosts }: PropsType) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadedBlogPosts, setLoadedBlogPosts] = useState(blogPosts);
  const fetcher = useFetcher();

  useEffect(() => {
    fetcher('/api/blogs', { category: categories })
      .then((response) => {
        setLoadedBlogPosts(response.blogPosts);
      })
      .catch((err) => {
        console.error(err);
        setLoadedBlogPosts([]);
      });
  }, [categories, fetcher]);

  const onToggle = (value: Category) => {
    setCategories(
      categories.includes(value)
        ? categories.filter((category) => category !== value)
        : [...categories, value]
    );
  };

  // Pagination to add

  return (
    <Flex
      flex={1}
      maxW="1200px"
      margin="auto"
      px="40px"
      py="30px"
      flexDir={{ base: 'column', md: 'row' }}
      gap={10}
    >
      <Box flex={1} px={{ base: 0, md: '20px' }}>
        <Heading
          variant="h4"
          as="h4"
          pb="10px"
          mb="30px"
          borderBottom="1px solid var(--chakra-colors-orange-500)"
          w="250px"
        >
          Blog Posts
        </Heading>
        {loadedBlogPosts.map((blogPost, index) => (
          <BlogArticle key={index} blogPost={blogPost} />
        ))}
        {!loadedBlogPosts.length && (
          <Text fontStyle="italic">
            Aucun résultat, veuillez changer vos filtres
          </Text>
        )}
      </Box>
      <Box w="250px">
        <Heading
          variant="h4"
          as="h4"
          pb="10px"
          mb="30px"
          borderBottom="1px solid var(--chakra-colors-orange-500)"
        >
          Catégories
        </Heading>
        <UnorderedList listStyleType="none" ml={0}>
          {Object.keys(CategoryWordingMapping).map(
            (blogCategoryEnum: Category, index) => (
              <ListItem key={index} my={2}>
                <Checkbox
                  colorScheme="orange"
                  onChange={() => onToggle(blogCategoryEnum)}
                >
                  {CategoryWordingMapping[blogCategoryEnum]}
                </Checkbox>
              </ListItem>
            )
          )}
        </UnorderedList>
      </Box>
    </Flex>
  );
}

export default BlogPage;
