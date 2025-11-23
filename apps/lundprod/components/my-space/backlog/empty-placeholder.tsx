import { Box, Center, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { illustrationNotFound } from '~/lundprod/assets';

export const EmptyPlaceholder = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) => {
  return (
    <Center gap={4} pt="40px" flexDir={{ base: 'row', md: 'column' }}>
      <Image src={illustrationNotFound.src} maxW="300px" />
      <Flex maxW="500px" gap={2} flexDir="column" alignItems="flex-start">
        <Heading variant="h4">{title}</Heading>
        <Text>{description}</Text>
        {children}
      </Flex>
    </Center>
  );
};
