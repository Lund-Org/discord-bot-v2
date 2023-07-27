import {
  Box,
  Code as ChakraCode,
  Table as ChakraTable,
  Tbody,
  Td as ChakraTd,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { PriceConfig, SellConfig } from '@discord-bot-v2/common';
import styled from '@emotion/styled';

type CommandTableProps = {
  configSell: SellConfig;
  configPrice: PriceConfig;
};

const Table = styled(ChakraTable)`
  & tr:nth-of-type(odd) td {
    background: var(--chakra-colors-blackAlpha-400);
  }
  & tr td:nth-child(2) {
    border-left: 1px solid var(--chakra-colors-blackAlpha-600);
    border-right: 1px solid var(--chakra-colors-blackAlpha-600);
  }
`;
const Td = styled(ChakraTd)`
  padding-left: 12px;
  padding-right: 12px;
`;
const Code = styled(ChakraCode)`
  background: var(--chakra-colors-gray-300);
`;

export const CommandTable = ({
  configPrice,
  configSell,
}: CommandTableProps) => {
  const commands = [
    {
      cmd: '/gacha join',
      description: `Cette commande est la première qu'il faudra faire pour pouvoir jouer. Elle crée votre profil et vous offre 8 cartes`,
      example: '',
    },
    {
      cmd: '/gacha view <id>',
      description: `Permet d'afficher une carte pour avoir ses détails`,
      example: (
        <>
          <Code>/gacha view 9</Code>
          <Text>affichera la carte n°9</Text>
        </>
      ),
    },
    {
      cmd: '/gacha help',
      description: `Affiche les commandes disponibles`,
      example: '',
    },
    {
      cmd: '/gacha profile',
      description: `Permet de connaitre votre niveau par rapport aux cartes que vous avez et à voir combien d'xp il vous manque avant le prochain`,
      example: '',
    },
    {
      cmd: '/gacha daily',
      description: `Permet de faire un tirage quotidiennement d'une carte gratuitement. Le reset est chaque jour à minuit heure française`,
      example: '',
    },
    {
      cmd: '/gacha points',
      description: `Permet de savoir combien de points vous avez (la monnaie du jeu pour acheter des cartes)`,
      example: '',
    },
    {
      cmd: '/gacha cards',
      description: ` Permet de lister les cartes dans l'inventaire (une pagination est disponible via les réactions ◀️ et ▶️)`,
      example: '',
    },
    {
      cmd: '/gacha buy <1-6>',
      description: `Permet d'acheter des cartes avec vos points (${configPrice.price} points par cartes). Possibilité d'acheter entre 1 et 6 cartes.`,
      example: (
        <>
          <Code>/gacha buy 3</Code>
          <Text>
            vous dépensera {configPrice.price * 3} points et vous donnera 3
            cartes aléatoires
          </Text>
        </>
      ),
    },
    {
      cmd: '/gacha gold <id>',
      description: `Transforme 5 cartes basiques en une carte dorée du même type`,
      example: (
        <>
          <Code>/gacha gold 20</Code>
          <Text>transforme 5 cartes n°20 basique en une carte n°20 dorée</Text>
        </>
      ),
    },
    {
      cmd: '/gacha fusion',
      description: `Permet de sacrifier les cartes composants en une carte fusion. Vous pouvez les retrouver dans la liste disponible ci-dessus (l'indication est en haut à gauche de la carte et si vous cliquez dessus, vous voyez les composants). La commande fait apparaitre un menu déroulant des fusions possibles à faire, vous n'avez qu'à choisir la carte que vous voulez récupérer.`,
      example: '',
    },
    {
      cmd: '/gacha twitch <pseudo>',
      description: `Permet de lier son pseudo twitch à son compte de gacha pour les rewards achetées en Madeleine sur Twitch (temporairement indisponible). Votre lien twitch apparaitra sur votre profil`,
      example: (
        <>
          <Code>/gacha twitch LundProd</Code>
          <Text>va lier votre chaine Twitch au gacha</Text>
        </>
      ),
    },
    {
      cmd: '/gacha sell <id> <basic|gold> <quantité>',
      description: (
        <Box>
          <Text as="span">
            Permet de vendre des cartes pour gagner des points. Vous gagnez{' '}
          </Text>
          <Code display="inline">
            {configSell.basic} x le niveau de la carte x la quantité de carte
            vendu{' '}
          </Code>
          <Text as="span">pour les cartes basiques et </Text>
          <Code display="inline">
            {configSell.gold} x le niveau de la carte x la quantité de carte
            vendu{' '}
          </Code>
          <Text as="span">pour les cartes dorées</Text>
        </Box>
      ),
      example: (
        <>
          <Code>/gacha sell 12 basic 3</Code>
          <Text>
            va vendre 3 cartes basiques n°12 et donner {configSell.basic * 3}{' '}
            points
          </Text>
        </>
      ),
    },
    {
      cmd: '/gacha gift <code>',
      description: `Permet de récupérer un cadeau`,
      example: (
        <>
          <Code>/gacha gift CODE_CADEAU</Code>
          <Text>
            vous donnera un cadeau tel que des points, des cartes basiques ou
            dorées
          </Text>
        </>
      ),
    },
    {
      cmd: '/gacha dismantle <id>',
      description: `Permet de transformer une carte dorée en 4 basique`,
      example: (
        <>
          <Code>/gacha dismantle 54</Code>
          <Text>
            va vous retirer une carte dorée mais vous donner en échange 4 cartes
            basiques n°54
          </Text>
        </>
      ),
    },
  ];

  return (
    <Box overflowX="auto" w="100%" maxW="100%">
      <Table mb="30px" minW="500px">
        <Thead>
          <Tr>
            <Th color="orange.300">Commande</Th>
            <Th color="orange.300">Description</Th>
            <Th color="orange.300">Exemple (si nécessaire)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {commands.map(({ cmd, description, example }, index) => (
            <Tr key={index}>
              <Td>
                <Code>{cmd}</Code>
              </Td>
              <Td>{description}</Td>
              <Td>
                {typeof example === 'string' ? <Text>{example}</Text> : example}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
