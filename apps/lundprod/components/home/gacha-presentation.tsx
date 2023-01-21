import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Text } from '@chakra-ui/react';
import { illustrationPlayingCards } from '~/lundprod/assets';
import { FullLinePresentation } from './full-line-presentation';
import { DarkStyledLink } from '../styled-link';

export const GachaPresentation = () => {
  return (
    <FullLinePresentation
      theme="light"
      title="Gacha"
      illustration={illustrationPlayingCards}
      illustrationPosition="right"
    >
      <Text mt={5}>
        Jeu sur mon discord de collection de cartes. Ces cartes sont basées sur
        l&apos;univers de ma chaine, par rapport aux jeux auxquels j&apos;ai pu
        jouer en live.
      </Text>
      <Text mt={5}>
        Contrairement aux gachas mobiles qui incitent aux microtransactions, ici
        tout est évidemment gratuit.
      </Text>
      <Text mt={5}>
        Vous pouvez y accéder&nbsp;
        <DarkStyledLink
          href="https://discord.gg/gJyu9p2"
          target="_blank"
          rel="noreferrer noopener"
        >
          ici
          <ExternalLinkIcon ml="3px" />
        </DarkStyledLink>
        &nbsp; ou consulter les cartes & le classement&nbsp;
        <DarkStyledLink href="/gacha">ici</DarkStyledLink>.
      </Text>
    </FullLinePresentation>
  );
};
