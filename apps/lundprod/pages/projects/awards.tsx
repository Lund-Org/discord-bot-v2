import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AwardConfigurator } from '~/lundprod/components/projects/award-configurator';
import { useGetDefaultAwards } from '~/lundprod/hooks/use-get-default-awards';

export const getStaticProps: GetStaticProps = async () => {
  return {
    revalidate: 3600,
    props: {},
  };
};

export function AwardsPage() {
  const { t } = useTranslation();
  const defaultCategories = useGetDefaultAwards();
  const [defaultConfig, setDefaultConfig] = useState<string[] | null>(null);

  return (
    <Box py={{ base: '15px', md: '30px' }} px={{ base: '15px', md: '50px' }}>
      <Heading as="h1" variant="h1" mb="20px">
        {t('awards.title')}
      </Heading>
      <Heading as="h2" variant="h6" mb="40px">
        {t('awards.subtitle')}
      </Heading>
      <Box>
        {defaultConfig === null ? (
          <>
            <Text mb="10px" whiteSpace="pre">
              {t('awards.disclaimer')}
            </Text>
            <Flex gap={2}>
              <Button
                colorScheme="orange"
                onClick={() => setDefaultConfig([t('awards.toEdit')])}
              >
                {t('awards.openEmpty')}
              </Button>
              <Button
                colorScheme="orange"
                onClick={() => setDefaultConfig(defaultCategories)}
              >
                {t('awards.openDefaultGA')}
              </Button>
            </Flex>
          </>
        ) : (
          <AwardConfigurator defaultConfig={defaultConfig} />
        )}
      </Box>
    </Box>
  );
}

export default AwardsPage;
