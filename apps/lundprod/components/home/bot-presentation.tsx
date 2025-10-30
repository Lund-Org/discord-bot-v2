import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Text } from '@chakra-ui/react';

import { illustrationFirmware } from '~/lundprod/assets';

import { LightStyledLink } from '../styled-link';
import { FullLinePresentation } from './full-line-presentation';
import { Trans, useTranslation } from 'react-i18next';

export const BotPresentation = () => {
  const { t } = useTranslation();

  return (
    <FullLinePresentation
      theme="dark"
      title={t('home.bot.title')}
      illustration={illustrationFirmware}
      illustrationPosition="left"
    >
      <Text mt={5}>
        <Trans
          i18nKey="home.bot.line1"
          components={{
            hltbLink: (
              <LightStyledLink
                href="https://howlongtobeat.com/"
                target="_blank"
                rel="noreferrer noopener"
              />
            ),
            externalIcon: <ExternalLinkIcon ml="3px" />,
          }}
        />
      </Text>
      <Text mt={5}>{t('home.bot.line2')}</Text>
      <Text mt={5}>
        <Trans
          i18nKey="home.bot.line3"
          components={{
            darkLinkGithub: (
              <LightStyledLink
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
