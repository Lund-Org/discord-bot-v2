import { Text } from '@chakra-ui/react';
import Link from 'next/link';

import { MenuLink } from './styled-components';

export const ProjectMenu = ({ onClick }: { onClick: () => void }) => {
  return (
    <MenuLink isActive={false}>
      <Link href="#">
        <Text as="span" color="orange.600" cursor="not-allowed">
          Projets (à venir)
        </Text>
      </Link>
    </MenuLink>
  );
};
