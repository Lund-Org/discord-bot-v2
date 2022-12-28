import { Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const Center = ({ children }: { children: ReactNode }) => (
  <Flex textAlign="center" justifyContent="center">
    {children}
  </Flex>
);
