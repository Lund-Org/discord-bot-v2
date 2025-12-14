import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const MobileBox = styled(Box)`
  @media (max-width: 768px) {
    display: block;
  }
  @media (min-width: 769px) {
    display: none;
  }
`;

export const DesktopBox = styled(Box)`
  @media (max-width: 768px) {
    display: none;
  }
  @media (min-width: 769px) {
    display: flex;
  }
`;
