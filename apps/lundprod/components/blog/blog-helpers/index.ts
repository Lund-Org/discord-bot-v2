import type { MDXComponents } from 'mdx/types';
import * as NextScript from 'next/script';

export const Script = NextScript as unknown as MDXComponents;

export * from './center';
export * from './collapse';
export * from './colored-spacer';
export * from './gallery';
export * from './paragraph-with-img';
export * from './spacer';
export * from './spoiler';
export * from './summary';
export * from './video';
