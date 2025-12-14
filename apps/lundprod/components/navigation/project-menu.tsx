import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { isProjectPage } from '~/lundprod/utils/url';

import { MenuLink } from './styled-components';

export const ProjectMenu = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  const { pathname } = useRouter();

  return (
    <MenuLink isActive={isProjectPage(pathname)} onClick={onClick}>
      <Link href="/projects">{t('menu.projects')}</Link>
    </MenuLink>
  );
};
