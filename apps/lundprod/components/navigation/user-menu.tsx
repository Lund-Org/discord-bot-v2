import Link from 'next/link';
import { useRouter } from 'next/router';

import { isUsersPage } from '~/lundprod/utils/url';

import { MenuLink } from './styled-components';

export const UserMenu = ({ onClick }: { onClick: () => void }) => {
  const { pathname } = useRouter();

  return (
    <MenuLink isActive={isUsersPage(pathname)} onClick={onClick}>
      <Link href="/u/list">Utilisateurs</Link>
    </MenuLink>
  );
};
