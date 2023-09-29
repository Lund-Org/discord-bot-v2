import Link from 'next/link';
import { useRouter } from 'next/router';

import { isProjectPage } from '~/lundprod/utils/url';

import { MenuLink } from './styled-components';

export const ProjectMenu = ({ onClick }: { onClick: () => void }) => {
  const { pathname } = useRouter();

  return (
    <MenuLink isActive={isProjectPage(pathname)}>
      <Link href="/projects">Projets</Link>
    </MenuLink>
  );
};
