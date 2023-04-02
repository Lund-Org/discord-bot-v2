import { Box, Divider, Flex, Heading, Image, Text } from '@chakra-ui/react';

import { illustrationBookReading } from '~/lundprod/assets';

export const Welcome = () => {
  return (
    <Flex
      flexDirection={{ base: 'column-reverse', md: 'row' }}
      alignItems={{ base: 'initial', md: 'center' }}
      mb={{ base: '40px', md: '60px' }}
    >
      <Box
        w={{ base: '100%', md: '50%' }}
        m={{ base: 'auto', md: '0 20px 0 0 ' }}
        maxW="500px"
      >
        <Image
          src={illustrationBookReading.src}
          alt="Welcome illustration"
          w="100%"
          maxW="500px"
          m="auto"
        />
      </Box>
      <Box
        ml="auto"
        w={{ base: '100%', md: '50%' }}
        mb={{ base: '40px', md: '0px' }}
      >
        <Heading color="orange.300">Bienvenue</Heading>
        <Divider mb={10} />
        <Text mt={5}>
          Je suis Florian, Lund sur internet, j&apos;ai 29 ans et je suis
          développeur.
        </Text>
        <Text mt={5}>
          Ici, vous trouverez tous mes travaux et liens utiles vers les
          différentes plate-formes.
        </Text>
        <Text mt={5}>
          Les projets sont très variés, cherchez votre bonheur.
        </Text>
      </Box>
    </Flex>
  );
};
