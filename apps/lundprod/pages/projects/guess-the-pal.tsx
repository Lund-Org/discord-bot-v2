import { Box, Button, Heading, Text, useBoolean } from '@chakra-ui/react';
import { GetStaticProps } from 'next';

import { LightStyledLink } from '~/lundprod/components/styled-link';

import { GuessThePalForm } from '~/lundprod/components/projects/guess-the-pal-form';
import { Trans, useTranslation } from 'react-i18next';

export const getStaticProps: GetStaticProps = async () => {
  return {
    revalidate: 3600,
    props: {
      cdnUrl: process.env.NEXT_PUBLIC_CDN_URL,
    },
  };
};

export function GuessThePal({ cdnUrl }: { cdnUrl: string }) {
  const { t } = useTranslation();
  const [hasStarted, setHasStarted] = useBoolean(false);

  return (
    <Box pt="40px" px="30px" textAlign="center" maxW="1024px" mx="auto">
      <Heading>{t('projects.guessPal.title')}</Heading>
      <Text mt="30px">
        <Trans
          i18nKey="projects.guessPal.description"
          components={{
            lightLink: (
              <LightStyledLink
                href="https://www.youtube.com/watch?v=BZCftBSm8kA"
                target="_blank"
              />
            ),
          }}
        />
      </Text>
      <Text>{t('projects.guessPal.hint')}</Text>
      {!hasStarted ? (
        <Button
          colorScheme="orange"
          onClick={() => setHasStarted.on()}
          mt="40px"
        >
          {t('projects.guessPal.start')}
        </Button>
      ) : (
        <GuessThePalForm cdnUrl={cdnUrl} />
      )}
    </Box>
  );
}

export default GuessThePal;
