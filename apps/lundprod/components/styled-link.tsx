import styled from '@emotion/styled';
import Link from 'next/link';

export const LightStyledLink = styled(Link)`
  text-decoration: underline;
  white-space: nowrap;

  &:hover {
    color: var(--chakra-colors-orange-300);
  }

  svg {
    vertical-align: baseline;
    margin-bottom: -2px;
  }
`;

export const DarkStyledLink = styled(Link)`
  text-decoration: underline;
  white-space: nowrap;

  &:hover {
    color: var(--chakra-colors-orange-800);
  }

  svg {
    vertical-align: baseline;
    margin-bottom: -2px;
  }
`;
