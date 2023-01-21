import { useRouter } from 'next/router';
import { MenuLink } from './styled-components';
import { isBlogPage } from '~/lundprod/utils/url';
import Link from 'next/link';

export const BlogMenu = ({ onClick }: { onClick: () => void }) => {
  const { pathname } = useRouter();

  return (
    <MenuLink isActive={isBlogPage(pathname)} onClick={onClick}>
      <Link href="/blog">Blog</Link>
    </MenuLink>
  );
};
