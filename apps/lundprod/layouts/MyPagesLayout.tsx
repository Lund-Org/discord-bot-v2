import { Box, Flex, Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';

type MyPagesLayoutProps = {
  children: ReactNode;
  title: string;
  actions?: ReactNode;
};

export const MyPagesLayout = ({
  children,
  title,
  actions,
}: MyPagesLayoutProps) => {
  return (
    <Flex flexDir="column">
      <Box
        h="80px"
        p={{ base: '8px', md: '12px' }}
        borderBottom="1px solid"
        borderColor="blue.500"
      >
        <Flex h="100%" maxW="1200px" mx="auto" alignItems="center">
          <Heading variant="h3" flex={1}>
            {title}
          </Heading>
          <Box ml="auto" mr={0}>
            {actions}
          </Box>
        </Flex>
      </Box>
      <Box maxW="1200px" w="100%" mx="auto" flex={1} pt="40px">
        {children}
      </Box>
    </Flex>
  );
};
