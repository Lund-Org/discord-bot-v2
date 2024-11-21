import { Box, Button, Heading, Text, useBoolean } from '@chakra-ui/react';
import { GetStaticProps } from 'next';

import { ProjectLine } from '~/lundprod/components/projects/project-line';

import { getProjects } from '../../utils/data/projects';
import { Trans, useTranslation } from 'react-i18next';
import { useState } from 'react';
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
    <Box py="30px" px="50px">
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
