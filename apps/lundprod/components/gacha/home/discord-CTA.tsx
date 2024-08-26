import { Heading } from '@chakra-ui/react';

import { networks } from '~/lundprod/utils/url';

import { LightStyledLink } from '../../styled-link';
import { Trans } from 'react-i18next';

export const DiscordCTA = () => {
  const discordNetwork = networks.lundprod.find(
    (network) => network.title === 'Discord',
  );

  return (
    <Heading variant="h6" as="h6" my="30px" textAlign="center">
      <Trans
        i18nKey="gacha.index.discordCTA"
        components={{
          lightLink: <LightStyledLink href={discordNetwork.url} />,
        }}
      />
    </Heading>
  );
};
