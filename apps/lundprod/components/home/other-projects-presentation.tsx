import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Text } from '@chakra-ui/react';

import { illustrationSketching } from '~/lundprod/assets';

import { LightStyledLink } from '../styled-link';
import { FullLinePresentation } from './full-line-presentation';
import { networks } from '~/lundprod/utils/url';
import { Trans } from 'react-i18next';

export const OtherProjectsPresentation = () => {
  const discordNetwork = networks.lundprod.find(
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
        <Trans
          i18nKey="home.other.line1"
          components={{
            projectLink: <LightStyledLink href="/projects" />,
            discordLink: (
              <LightStyledLink
                href={discordNetwork.url}
                target="_blank"
                rel="noreferrer noopener"
              />
            ),
            externalIcon: <ExternalLinkIcon ml="3px" />,
          }}
        />
      </Text>
    </FullLinePresentation>
  );
};
