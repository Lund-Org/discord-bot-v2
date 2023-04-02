import Link from 'next/link';
import { useRouter } from 'next/router';

import { isBlogPage } from '~/lundprod/utils/url';

import { MenuLink } from './styled-components';

export const BlogMenu = ({ onClick }: { onClick: () => void }) => {
  const { pathname } = useRouter();

  return (
    <MenuLink isActive={isBlogPage(pathname)} onClick={onClick}>
      <Link href="/blog">Blog</Link>
    </MenuLink>
  );
};
