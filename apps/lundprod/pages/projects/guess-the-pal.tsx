import { Box, Button, Heading, Text, useBoolean } from '@chakra-ui/react';
import { GetStaticProps } from 'next';

import { LightStyledLink } from '~/lundprod/components/styled-link';

import { GuessThePalForm } from '~/lundprod/components/projects/guess-the-pal-form';

export const getStaticProps: GetStaticProps = async () => {
  return {
    revalidate: 3600,
    props: {
      cdnUrl: process.env.CDN_URL,
    },
  };
};

export function GuessThePal({ cdnUrl }) {
  const [hasStarted, setHasStarted] = useBoolean(false);

  return (
    <Box pt="40px" px="30px" textAlign="center" maxW="1024px" mx="auto">
      <Heading>Devine le Pal !</Heading>
      <Text mt="30px">
        Tu connais surement le jeu{' '}
        <LightStyledLink
          href="https://www.youtube.com/watch?v=BZCftBSm8kA"
          target="_blank"
        >
          "Who's that pokemon"
        </LightStyledLink>{' '}
        ? Et bien c'est le même principe mais pour les Pals de Palworld.
      </Text>
      <Text>
        Vous verrez la silhouette d'un Pal et il faudra deviner quel est le
        petit monstre qui se cache derrière !
      </Text>
      {!hasStarted ? (
        <Button
          colorScheme="orange"
          onClick={() => setHasStarted.on()}
          mt="40px"
        >
          Commencer
        </Button>
      ) : (
        <GuessThePalForm cdnUrl={cdnUrl} />
      )}
    </Box>
  );
}

export default GuessThePal;
