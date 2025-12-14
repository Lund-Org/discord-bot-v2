import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Text } from '@chakra-ui/react';
import { Trans, useTranslation } from 'react-i18next';

import { illustrationPlayingCards } from '~/lundprod/assets';

import { DarkStyledLink } from '../styled-link';
import { FullLinePresentation } from './full-line-presentation';

export const GachaPresentation = () => {
  const { t } = useTranslation();

  return (
    <FullLinePresentation
      theme="light"
      title={t('home.gacha.title')}
      illustration={illustrationPlayingCards}
      illustrationPosition="right"
    >
      <Text mt={5}>{t('home.gacha.line1')}</Text>
      <Text mt={5}>{t('home.gacha.line2')}</Text>
      <Text mt={5}>
        <Trans
          i18nKey="home.gacha.line3"
          components={{
            darkLinkDiscord: (
              <DarkStyledLink
                href="https://discord.gg/tCYmDm2"
                target="_blank"
                rel="noreferrer noopener"
              />
            ),
            externalIcon: <ExternalLinkIcon ml="3px" />,
            darkLinkGacha: <DarkStyledLink href="/gacha" />,
          }}
        />
      </Text>
    </FullLinePresentation>
  );
};
