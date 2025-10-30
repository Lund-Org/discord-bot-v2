import { Box, Center, Heading, Image, Text } from '@chakra-ui/react';
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
    <Center gap={4} pt="40px">
      <Image src={illustrationNotFound.src} maxW="300px" />
      <Box maxW="500px">
        <Heading variant="h4">{title}</Heading>
        <Text mt={2}>{description}</Text>
        {children}
      </Box>
    </Center>
  );
};
