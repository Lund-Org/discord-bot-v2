import Link from 'next/link';
import { useRouter } from 'next/router';

import { isHomePage } from '~/lundprod/utils/url';

import { MenuLink } from './styled-components';

export const HomeMenu = ({ onClick }: { onClick: () => void }) => {
  const { pathname } = useRouter();

  return (
    <MenuLink isActive={isHomePage(pathname)} onClick={onClick}>
      <Link href="/">Accueil</Link>
    </MenuLink>
  );
};
