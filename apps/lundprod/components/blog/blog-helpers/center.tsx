import { Flex, FlexProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const Center = ({
  children,
  ...rest
}: { children: ReactNode } & FlexProps) => (
  <Flex alignItems="center" justifyContent="center" {...rest}>
    {children}
  </Flex>
);
