import Link from 'next/link';
import { useRouter } from 'next/router';

import { isContactPage } from '~/lundprod/utils/url';

import { MenuLink } from './styled-components';
import { useTranslation } from 'react-i18next';

export const ContactMenu = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  const { pathname } = useRouter();

  return (
    <MenuLink isActive={isContactPage(pathname)} onClick={onClick}>
      <Link href="/contact">{t('menu.contact')}</Link>
    </MenuLink>
  );
};
