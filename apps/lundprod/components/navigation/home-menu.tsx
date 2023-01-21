import { useRouter } from 'next/router';
import { MenuLink } from './styled-components';
import { isHomePage } from '../../utils/url';
import Link from 'next/link';

export const HomeMenu = ({ onClick }: { onClick: () => void }) => {
  const { pathname } = useRouter();

  return (
    <MenuLink isActive={isHomePage(pathname)} onClick={onClick}>
      <Link href="/">Accueil</Link>
    </MenuLink>
  );
};
