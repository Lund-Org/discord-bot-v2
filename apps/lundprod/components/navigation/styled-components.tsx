import styled from '@emotion/styled';

import { MENU_HEIGHT } from '~/lundprod/utils/constants';

export const MenuBox = styled.div<{ isOpen: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '35px',

  '@media (max-width: 768px)': {
    display: props.isOpen ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '10px',
    top: `calc(${MENU_HEIGHT} - 10px)`,
    left: 0,
    padding: '20px',
    position: 'absolute',
    zIndex: 2,
    background: 'var(--chakra-colors-gray-800)',
    border: '1px solid white',
    borderRadius: 'var(--chakra-radii-md)',
    minWidth: 'var(--chakra-sizes-3xs)',
  },
}));
export const MenuLink = styled.div<{ isActive: boolean }>((props) => ({
  ...(props.isActive && {
    color: 'var(--chakra-colors-orange-100)',
    fontWeight: 'bold',
  }),
}));
