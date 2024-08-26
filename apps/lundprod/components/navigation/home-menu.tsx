import Link from 'next/link';
import { useRouter } from 'next/router';

import { isHomePage } from '~/lundprod/utils/url';

import { MenuLink } from './styled-components';
import { useTranslation } from 'react-i18next';

export const HomeMenu = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  const { pathname } = useRouter();

  return (
    <MenuLink isActive={isHomePage(pathname)} onClick={onClick}>
      <Link href="/">{t('menu.home')}</Link>
    </MenuLink>
  );
};
