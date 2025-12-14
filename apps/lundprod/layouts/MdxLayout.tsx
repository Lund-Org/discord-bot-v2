import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import type { BlogPost, Tag } from '@prisma/client';
import Link from 'next/link';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { BlogFooter } from '../components/blog/blog-footer';
import { BlogHeader } from '../components/blog/blog-header';
import { getTitleFromFilename } from '../utils/blog';

export type MdxLayoutProps = {
  children: ReactNode;
  blogPost: BlogPost & { tags: Tag[] };
};

export const MdxLayout = ({ blogPost, children }: MdxLayoutProps) => {
  const { t } = useTranslation();
  const currentName = getTitleFromFilename(blogPost.filename);

  return (
    <>
      <Breadcrumb
        p="15px 30px"
        bg="gray.900"
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/">
            {t('menu.home')}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/blog">
            {t('menu.blog')}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">{currentName}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box maxW="1200px" margin="auto" py="30px" px="40px">
        <BlogHeader blogPost={blogPost} title={currentName} />
        <Box mt="20px" id="blog-container">
          {children}
        </Box>
        <BlogFooter blogPost={blogPost} />
      </Box>
    </>
  );
};
