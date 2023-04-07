import { prisma } from '@discord-bot-v2/prisma';
import { readFileSync } from 'fs';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { join, resolve } from 'path';

import { components } from '~/lundprod/components/mdx-components';
import { MdxLayout } from '~/lundprod/layouts/MdxLayout';

export async function getStaticPaths() {
  const mdxList = await prisma.blogPost.findMany({
    select: { filename: true },
  });

  return {
    paths: mdxList.map(({ filename }) => ({ params: { filename } })),
    fallback: false, // can also be true or 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const blogPost = await prisma.blogPost.findUnique({
    where: { filename: params.filename },
    include: { tags: true },
  });
  const dir = resolve('./public', 'mdx');
  const mdxContent = readFileSync(join(dir, `${params.filename}.mdx`));

  return {
    props: {
      blogPost: JSON.parse(JSON.stringify(blogPost)),
      mdxSource: await serialize(mdxContent, {
        // mdxOptions: { development: false },
      }),
    },
  };
}

export default function BlogPostPage({ blogPost, mdxSource }) {
  return (
    <MdxLayout blogPost={blogPost}>
      <MDXRemote {...mdxSource} components={components} />
    </MdxLayout>
  );
}
