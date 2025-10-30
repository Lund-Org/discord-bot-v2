import Link from 'next/link';
import { useRouter } from 'next/router';

import { isUsersPage } from '~/lundprod/utils/url';

import { MenuLink } from './styled-components';
import { useTranslation } from 'react-i18next';

export const UserMenu = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  const { pathname } = useRouter();

  return (
    <MenuLink isActive={isUsersPage(pathname)} onClick={onClick}>
      <Link href="/u/list">{t('menu.users')}</Link>
    </MenuLink>
  );
};
