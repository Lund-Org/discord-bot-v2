import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Text } from '@chakra-ui/react';

import { illustrationCodeThinking } from '~/lundprod/assets';

import { DarkStyledLink } from '../styled-link';
import { FullLinePresentation } from './full-line-presentation';
import { Trans, useTranslation } from 'react-i18next';

export const WebsitePresentation = () => {
  const { t } = useTranslation();

  return (
    <FullLinePresentation
      theme="light"
      title={t('home.website.title')}
      illustration={illustrationCodeThinking}
      illustrationPosition="right"
    >
      <Text mt={5}>{t('home.website.line1')}</Text>
      <Text mt={5}>{t('home.website.line2')}</Text>
      <Text mt={5}>
        <Trans
          i18nKey="home.website.line3"
          components={{
            darkLinkGithub: (
              <DarkStyledLink
                href="https://github.com/Lund-Org/discord-bot-v2"
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
