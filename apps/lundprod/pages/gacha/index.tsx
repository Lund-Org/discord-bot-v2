import { ChevronRightIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import {
  CardXPConfig,
  ChancesConfig,
  GachaConfigEnum,
  PriceConfig,
  SellConfig,
} from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import { GetStaticProps } from 'next';

import { CommandTable } from '~/lundprod/components/gacha/home/command-table';
import { DiscordCTA } from '~/lundprod/components/gacha/home/discord-CTA';
import { LevelsTable } from '~/lundprod/components/gacha/home/levels-table';
import { LightStyledLink } from '~/lundprod/components/styled-link';

type GachaPageProps = {
  configSell: SellConfig;
  configPrice: PriceConfig;
  configDropChances: ChancesConfig;
  configCardXP: CardXPConfig;
  configLevels: Record<string, number>;
};

export const getStaticProps: GetStaticProps<GachaPageProps> = async () => {
  const configSell = (
    await prisma.config.findUnique({
      where: { name: GachaConfigEnum.SELL },
    })
  )?.value as SellConfig;
  const configPrice = (
    await prisma.config.findUnique({
      where: { name: GachaConfigEnum.PRICE },
    })
  )?.value as PriceConfig;
  const configDropChances = (
    await prisma.config.findUnique({
      where: { name: GachaConfigEnum.DROP_CHANCES },
    })
  )?.value as ChancesConfig;
  const configCardXP = (
    await prisma.config.findUnique({
      where: { name: GachaConfigEnum.CARD_XP },
    })
  )?.value as CardXPConfig;
  const configLevels = (
    await prisma.config.findUnique({
      where: { name: GachaConfigEnum.LEVELS },
    })
  )?.value as Record<string, number>;

  return {
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every hour
    revalidate: 3600, // In seconds
    // Passed to the page component as props
    props: {
      configSell,
      configPrice,
      configDropChances,
      configCardXP,
      configLevels,
    },
  };
};

export function GachaPage({
  configSell,
  configPrice,
  configDropChances,
  configCardXP,
  configLevels,
}: GachaPageProps) {
  return (
    <Flex justifyContent="center">
      <Box maxW="1200px" p="30px" overflow="hidden">
        <Heading
          variant="h3"
          as="h3"
          pb="10px"
          mb="30px"
          borderBottom="1px solid var(--chakra-colors-orange-500)"
          maxW="400px"
        >
          Introduction - Gacha
        </Heading>
        <Text mb="10px">
          Derrière ce mot qui fait peur et qui fait penser à tous ces jeux
          mobiles qui en veulent à votre porte-monnaie se cache un jeu tout à
          fait sain ici. En effet, via Discord, vous pouvez jouer à ce petit jeu
          de collection de carte, sans dépenser le moindre euro.
        </Text>
        <Text mb="30px">
          Ce jeu est basé sur le &quot;lore&quot; de ma chaine Youtube/Twitch,
          de mon expérience passée sur internet, ou tout simplement de petits
          délires avec la communauté. Certains ayant même leur propre carte ! Et
          si jamais vous voulez comprendre certaines cartes, son histoire vous
          est expliquée dans la page &quot;liste&quot;.
        </Text>
        <Text mb="10px">
          <ChevronRightIcon mr="4px" />
          La liste des cartes est présente{' '}
          <LightStyledLink href="/gacha/list">ici</LightStyledLink>
        </Text>
        <Text mb="60px">
          <ChevronRightIcon mr="4px" />
          Le classement des joueurs est{' '}
          <LightStyledLink href="/gacha/ranking">ici</LightStyledLink>
        </Text>
        <Heading
          variant="h6"
          as="h6"
          mb="20px"
          pb="5px"
          borderBottom="1px solid var(--chakra-colors-orange-500)"
          display="flex"
          alignItems="center"
        >
          <QuestionOutlineIcon mr="12px" />
          Comment ça marche ?
        </Heading>
        <Text mb="30px">
          Sur Discord, et une fois le rôle associé récupéré dans le channel
          adéquate, une section apparait avec différents nouveaux channels.
          Celui qui nous intéresse, c&apos;est celui nommé
          &quot;#commandes&quot;. Voici la liste des différentes commandes
          disponibles :
        </Text>
        <CommandTable configSell={configSell} configPrice={configPrice} />
        <Text mb="10px" fontWeight="bold">
          Quelques informations importantes :
        </Text>
        <UnorderedList>
          <ListItem>
            Chaque message sur le serveur vous donne 50 points (avec un cooldown
            d&apos;une minute tout de même)
          </ListItem>
          <ListItem>
            Vous êtes capés à un capital de points maximum de 15 000 points.
          </ListItem>
          <ListItem>
            <Text>
              Il y a actuellement 142 cartes disponibles, ce qui donne les
              chances suivantes :
            </Text>
            <UnorderedList listStyleType="disclosure-closed" ml="50px">
              {Object.keys(configDropChances)
                .sort()
                .map((key) => {
                  const dropChance = configDropChances[key];

                  return (
                    <ListItem key={key}>
                      <Text as="span" color="orange.300">
                        {dropChance}%
                      </Text>
                      <Text as="span"> de chance de tomber sur une carte </Text>
                      <Text as="span" color="orange.300">
                        niveau {key}
                      </Text>
                    </ListItem>
                  );
                })}
            </UnorderedList>
          </ListItem>
          <ListItem>
            Pour créer une carte fusion dorée, comme pour les autres cartes, il
            faut 5 fois la version basique pour pouvoir la golder
          </ListItem>
          <ListItem>L&apos;XP est calculé de la manière suivante : </ListItem>
          <UnorderedList listStyleType="disclosure-closed" ml="50px">
            <ListItem>
              {configCardXP.basic} x le niveau de la carte pour les cartes
              basiques
            </ListItem>
            <ListItem>
              {configCardXP.gold} x le niveau de la carte pour les cartes dorées
            </ListItem>
            <ListItem>
              Les cartes comptent une fois par type, ainsi si vous avez 14
              cartes basiques n°3 et 5 cartes dorées n°3, vous aurez uniquement{' '}
              {configCardXP.basic + configCardXP.gold}xp ({configCardXP.basic} +
              {configCardXP.gold})
            </ListItem>
          </UnorderedList>
        </UnorderedList>
        <LevelsTable configLevels={configLevels} />
        <DiscordCTA />
      </Box>
    </Flex>
  );
}

export default GachaPage;
