import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { isBlogPage } from '~/lundprod/utils/url';

import { MenuLink } from './styled-components';

export const BlogMenu = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  const { pathname } = useRouter();

  return (
    <MenuLink isActive={isBlogPage(pathname)} onClick={onClick}>
      <Link href="/blog">{t('menu.blog')}</Link>
    </MenuLink>
  );
};
