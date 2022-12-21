import styled from '@emotion/styled';
import Link from 'next/link';

export const LightStyledLink = styled(Link)`
  text-decoration: underline;

  &:hover {
    color: var(--chakra-colors-orange-300);
  }
`;

export const DarkStyledLink = styled(Link)`
  text-decoration: underline;

  &:hover {
    color: var(--chakra-colors-orange-800);
  }
`;
