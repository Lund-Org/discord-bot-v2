import { Heading } from '@chakra-ui/react';

import { networks } from '~/lundprod/utils/url';

import { LightStyledLink } from '../../styled-link';

export const DiscordCTA = () => {
  const discordNetwork = networks.find(
    (network) => network.title === 'Discord'
  );

  return (
    <Heading variant="h6" as="h6" my="30px" textAlign="center">
      Prêt à jouer ?{' '}
      <LightStyledLink href={discordNetwork.url}>
        Rejoignez le Discord !
      </LightStyledLink>
    </Heading>
  );
};
