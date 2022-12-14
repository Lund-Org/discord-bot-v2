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
import { BlogArticle } from '../../components/blog/blog-article';
import { CategoryWordingMapping } from '../../utils/blog';
import { getManyBlogPosts } from '../../utils/api/blog';
import { getParam } from '../../utils/next';

type PropsType = {
  blogPosts: (BlogPost & {
    tags: Tag[];
  })[];
};

export const getServerSideProps: GetServerSideProps<PropsType> = async ({
  query,
}) => {
  const pageParam = getParam(query.page, '1');
  const categories =
    typeof query.category === 'string'
      ? [query.category]
      : query.category || [];
  const page = parseInt(pageParam, 10) <= 0 ? 1 : parseInt(pageParam, 10);
  const blogPosts = await getManyBlogPosts({
    page,
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

  useEffect(() => {
    const queryParams = new URLSearchParams();

    categories.forEach((category) => {
      queryParams.append('category', category);
    });

    fetch(`/api/blogs?${queryParams.toString()}`)
      .then((response) => response.json())
      .then((json) => {
        setLoadedBlogPosts(json.blogPosts);
      });
  }, [categories]);

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
            Aucun r??sultat, veuillez changer vos filtres
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
          Cat??gories
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
