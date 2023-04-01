import { useRouter } from 'next/router';
import { MenuLink } from './styled-components';
import { isUsersPage } from '~/lundprod/utils/url';
import Link from 'next/link';

export const UserMenu = ({ onClick }: { onClick: () => void }) => {
  const { pathname } = useRouter();

  return (
    <MenuLink isActive={isUsersPage(pathname)} onClick={onClick}>
      <Link href="/u/list">Utilisateurs</Link>
    </MenuLink>
  );
};
