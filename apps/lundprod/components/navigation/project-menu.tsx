import Link from 'next/link';
import { useRouter } from 'next/router';

import { isProjectPage } from '~/lundprod/utils/url';

import { MenuLink } from './styled-components';
import { useTranslation } from 'react-i18next';

export const ProjectMenu = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  const { pathname } = useRouter();

  return (
    <MenuLink isActive={isProjectPage(pathname)} onClick={onClick}>
      <Link href="/projects">{t('menu.projects')}</Link>
    </MenuLink>
  );
};
