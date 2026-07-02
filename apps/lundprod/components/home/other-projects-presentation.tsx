import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Text } from '@chakra-ui/react';
import { Trans } from 'react-i18next';

import { illustrationSketching } from '~/lundprod/assets';
import { networks } from '~/lundprod/utils/url';

import { DarkStyledLink } from '../styled-link';
import { FullLinePresentation } from './full-line-presentation';

export const OtherProjectsPresentation = () => {
  const discordNetwork = networks.lundprod.find(
    (network) => network.title === 'Discord',
  );

  return (
    <FullLinePresentation
      theme="light"
      title="Autres projets"
      illustration={illustrationSketching}
      illustrationPosition="left"
    >
      <Text mt={5}>
        <Trans
          i18nKey="home.other.line1"
          components={{
            projectLink: <DarkStyledLink href="/projects" />,
            discordLink: (
              <DarkStyledLink
                href={discordNetwork?.url || '#'}
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
