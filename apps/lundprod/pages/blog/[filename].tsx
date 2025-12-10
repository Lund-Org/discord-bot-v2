import { prisma } from '@discord-bot-v2/prisma';
import axios from 'axios';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { join, resolve } from 'path';
import remarkGfm from 'remark-gfm';

import { components } from '~/lundprod/components/mdx-components';
import { MdxLayout, MdxLayoutProps } from '~/lundprod/layouts/MdxLayout';

export async function getStaticPaths() {
  const mdxList = await prisma.blogPost.findMany({
    select: { filename: true },
  });

  return {
    paths: mdxList.map(({ filename }) => ({ params: { filename } })),
    fallback: 'blocking', // can also be true or 'blocking'
  };
}

export async function getStaticProps({
  params,
}: {
  params: { filename: string };
}) {
  const blogPost = await prisma.blogPost.findUnique({
    where: { filename: params.filename },
    include: { tags: true },
  });
  const dir = resolve('./public', 'mdx');

  let mdxContent;

  if (existsSync(join(dir, `${params.filename}.mdx`))) {
    mdxContent = readFileSync(join(dir, `${params.filename}.mdx`));
  } else {
    const remoteFile = await axios.get(
      `${process.env.NEXT_PUBLIC_CDN_URL}/blog-articles/${
        params.filename
      }.mdx?t=${Date.now()}`,
    );

    mdxContent = remoteFile.data;

    writeFileSync(join(dir, `${params.filename}.mdx`), mdxContent, {
      flag: 'w+',
    });
  }

  return {
    revalidate: 3600, // In seconds
    props: {
      blogPost: JSON.parse(JSON.stringify(blogPost)),
      mdxSource: await serialize(mdxContent, {
        // mdxOptions: { development: false },
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      }),
    },
  };
}

export default function BlogPostPage({
  blogPost,
  mdxSource,
}: {
  blogPost: MdxLayoutProps['blogPost'];
  mdxSource: any;
}) {
  return (
    <MdxLayout blogPost={blogPost}>
      <MDXRemote {...mdxSource} components={components} />
    </MdxLayout>
  );
}
