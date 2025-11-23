import { Flex, Image, Heading, Text, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { illustrationNotFound } from '~/lundprod/assets';

export const PlaceholderEmpty = () => {
  const { t } = useTranslation();

  return (
    <Flex
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      w="100%"
      py="50px"
    >
      <Image src={illustrationNotFound.src} maxW="400px" />
      <Box textAlign="center">
        <Heading>{t('profile.placeholder.title')}</Heading>
        <Text>{t('profile.placeholder.description')}</Text>
      </Box>
    </Flex>
  );
};
