import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Text } from '@chakra-ui/react';

import { illustrationSketching } from '~/lundprod/assets';

import { LightStyledLink } from '../styled-link';
import { FullLinePresentation } from './full-line-presentation';
import { networks } from '~/lundprod/utils/url';

export const OtherProjectsPresentation = () => {
  const discordNetwork = networks.find(
    (network) => network.title === 'Discord',
  );

  return (
    <FullLinePresentation
      theme="dark"
      title="Autres projets"
      illustration={illustrationSketching}
      illustrationPosition="left"
    >
      <Text mt={5}>
        Et bien d'autres projets sont disponibles ou en cours de réalisation
        comme des réalisations 3D, des jeux, et plus encore. Ils sont visibles
        dans la rubrique&nbsp;
        <LightStyledLink href="/projects">projet</LightStyledLink> mais vous
        pouvez aussi retrouver les annonces de nouveaux projets via&nbsp;
        <LightStyledLink
          href={discordNetwork.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          Discord
          <ExternalLinkIcon ml="3px" />
        </LightStyledLink>
      </Text>
    </FullLinePresentation>
  );
};
