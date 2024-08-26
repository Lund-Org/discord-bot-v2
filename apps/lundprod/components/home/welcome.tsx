import { Box, Divider, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { illustrationBookReading } from '~/lundprod/assets';

export const Welcome = () => {
  const { t } = useTranslation();
  const currentAge =
    new Date(
      Date.now() - new Date('1993-11-20T00:00:00Z').getTime(),
    ).getFullYear() - 1970;

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
        <Heading color="orange.300">{t('home.title')}</Heading>
        <Divider mb={10} />
        <Text mt={5}>{t('home.welcome.item1', { currentAge })}</Text>
        <Text mt={5}>{t('home.welcome.item2')}</Text>
        <Text mt={5}>{t('home.welcome.item3')}</Text>
      </Box>
    </Flex>
  );
};
