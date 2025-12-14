import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const ScrollContainer = styled(Box)`
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #666;
  }

  &::-webkit-scrollbar-thumb {
    background: #eee;
    border-radius: 3px;

    &:hover {
      background: #999;
    }
  }
`;
