import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Text } from '@chakra-ui/react';
import { illustrationFirmware } from '../../assets';
import { FullLinePresentation } from './full-line-presentation';
import { LightStyledLink } from '../styled-link';

export const BotPresentation = () => {
  return (
    <FullLinePresentation
      theme="dark"
      title="MauriceBot"
      illustration={illustrationFirmware}
      illustrationPosition="left"
    >
      <Text mt={5}>
        Bot Discord qui permet aux utilisateurs d&apos;accéder à diverses
        fonctionnalités, du petit jeu de Shifumi, à la possibilité de créer des
        sondages ou encore de requêter le site&nbsp;
        <LightStyledLink
          href="https://howlongtobeat.com/"
          target="_blank"
          rel="noreferrer noopener"
        >
          HowLongToBeat
          <ExternalLinkIcon ml="3px" />
        </LightStyledLink>
      </Text>
      <Text mt={5}>
        C&apos;est lui aussi qui permet aux utilisateurs de jouer au gacha via
        les commandes qu&apos;il rend disponible.
      </Text>
      <Text mt={5}>
        Vous pouvez retrouver le code du site et le bot sur&nbsp;
        <LightStyledLink
          href="https://github.com/Lund-Org/discord-bot-v2"
          target="_blank"
          rel="noreferrer noopener"
        >
          Github
          <ExternalLinkIcon ml="3px" />
        </LightStyledLink>
      </Text>
    </FullLinePresentation>
  );
};
