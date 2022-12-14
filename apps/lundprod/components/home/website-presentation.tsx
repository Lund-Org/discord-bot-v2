import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Text } from '@chakra-ui/react';
import { illustrationCodeThinking } from '../../assets';
import { FullLinePresentation } from './full-line-presentation';
import { DarkStyledLink } from './styled-link';

export const WebsitePresentation = () => {
  return (
    <FullLinePresentation
      theme="light"
      title="Lundprod.com"
      illustration={illustrationCodeThinking}
      illustrationPosition="right"
    >
      <Text mt={5}>
        Prévu pour accueillir tous mes projets, ce site a reçu plusieurs
        itérations.
      </Text>
      <Text mt={5}>
        Présentant de base uniquement les pages du gacha, il a évolué pour être
        plus propre en terme de design, mais aussi plus riche en fonctionnalité
        et informations.
      </Text>
      <Text mt={5}>
        Vous pouvez retrouver le code du site et le bot sur{' '}
        <DarkStyledLink
          href="https://github.com/Lund-Org/discord-bot-v2"
          target="_blank"
          rel="noreferrer noopener"
        >
          Github
          <ExternalLinkIcon ml="3px" />
        </DarkStyledLink>
      </Text>
    </FullLinePresentation>
  );
};
