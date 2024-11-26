import { Box, Button, Heading, Text, useBoolean } from '@chakra-ui/react';
import { GetStaticProps } from 'next';

import { useTranslation } from 'react-i18next';
import { AwardConfigurator } from '~/lundprod/components/projects/award-configurator';

export const getStaticProps: GetStaticProps = async () => {
  return {
    revalidate: 3600,
    props: {},
  };
};

export function AwardsPage() {
  const { t } = useTranslation();
  const [isDisclaimerDisplayed, setIsDisclaimerDisplayed] = useBoolean(true);

  return (
    <Box py={{ base: '15px', md: '30px' }} px={{ base: '15px', md: '50px' }}>
      <Heading as="h1" variant="h1" mb="20px">
        {t('awards.title')}
      </Heading>
      <Heading as="h2" variant="h6" mb="40px">
        {t('awards.subtitle')}
      </Heading>
      <Box>
        {isDisclaimerDisplayed ? (
          <>
            <Text mb="10px" whiteSpace="pre">
              {t('awards.disclaimer')}
            </Text>
            <Button colorScheme="orange" onClick={setIsDisclaimerDisplayed.off}>
              {t('awards.passDisclaimer')}
            </Button>
          </>
        ) : (
          <AwardConfigurator />
        )}
      </Box>
    </Box>
  );
}

export default AwardsPage;
