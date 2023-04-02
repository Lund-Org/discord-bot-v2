import { addPoints } from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import {
  CardType,
  Player,
  PlayerInventory,
  Prisma,
  User,
} from '@prisma/client';
import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';

import { GachaConfigEnum } from '../../enums/GachaEnum';
import { CardDraw } from '../../helpers/types';

type ChancesConfig = {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
};

export const userNotFoundWarning = async (
  interaction:
    | ChatInputCommandInteraction
    | StringSelectMenuInteraction
    | ButtonInteraction
) => {
  interaction.reply(
    `Avant de pouvoir jouer, crée un compte avec la commande "/gacha join"`
  );
};

export async function addCardsToInventory(
  user: User & { player: Player & { playerInventory: PlayerInventory[] } },
  cardsToAdd: CardDraw[],
  totalPrice: number
) {
  const isNewItem = (
    item:
      | Prisma.PlayerInventoryCreateArgs['data']
      | { id: number; incr: number }
  ): item is Prisma.PlayerInventoryCreateArgs['data'] => {
    return !('id' in item);
  };

  const groupedPlayerInventoryItems: Record<
    string,
    Prisma.PlayerInventoryCreateArgs['data'] | { id: number; incr: number }
  > = {};

  cardsToAdd.forEach((cardToAdd) => {
    const type = cardToAdd.isGold ? 'gold' : 'basic';
    const inventoryItem = user.player.playerInventory.find(
      (x) => x.cardTypeId === cardToAdd.cardType.id && x.type === type
    );
    const existingItem =
      groupedPlayerInventoryItems[
        `${type}-${cardToAdd.cardType.id}-${user.id}`
      ];

    if (existingItem && !isNewItem(existingItem)) {
      existingItem.incr++;
    } else if (inventoryItem) {
      groupedPlayerInventoryItems[
        `${type}-${cardToAdd.cardType.id}-${user.id}`
      ] = {
        id: inventoryItem.id,
        incr: 1,
      };
    } else {
      groupedPlayerInventoryItems[
        `${type}-${cardToAdd.cardType.id}-${user.id}`
      ] = {
        playerId: user.player.id,
        total: 1,
        type,
        cardTypeId: cardToAdd.cardType.id,
      };
    }
  });

  await Promise.all([
    addPoints(user.player.id, -totalPrice),
    ...Object.values(groupedPlayerInventoryItems).map(
      async (groupedPlayerInventoryItem) => {
        return isNewItem(groupedPlayerInventoryItem)
          ? prisma.playerInventory.create({
              data: groupedPlayerInventoryItem,
            })
          : prisma.playerInventory.update({
              where: { id: groupedPlayerInventoryItem.id },
              data: {
                total: { increment: groupedPlayerInventoryItem.incr },
              },
            });
      }
    ),
  ]);
}

export const drawCards = async (nbCardToDraw: number): Promise<CardDraw[]> => {
  const chancesJSON = await prisma.config.findUnique({
    where: { name: GachaConfigEnum.DROP_CHANCES },
  });
  const chancesConfig: ChancesConfig = chancesJSON?.value as ChancesConfig;
  const cardsDraw: CardDraw[] = [];

  for (let i = 0; i < nbCardToDraw; ++i) {
    const chances = Math.floor(Math.random() * 100);
    const loopValues = { currentOffset: 0, foundLevel: '1' };

    Object.keys(chancesConfig).some((configKey: keyof ChancesConfig) => {
      const value: number = chancesConfig[configKey];

      if (chances <= loopValues.currentOffset + value) {
        loopValues.foundLevel = configKey;
        return true;
      }

      loopValues.currentOffset += value;
    });

    const level = parseInt(loopValues.foundLevel, 10);
    const isGold = Math.floor(Math.random() * 100) < 4;
    const [randomCard] = await prisma.$queryRaw<[CardType]>`
      SELECT *
      FROM CardType
      WHERE CardType.level = ${level}
      AND isFusion = 0
      ORDER BY RAND()
      LIMIT 1
    `;

    cardsDraw.push({ cardType: randomCard, isGold });
  }

  return cardsDraw;
};

export function getCardEarnSummary(
  userWithInventory: User & {
    player: Player & { playerInventory: PlayerInventory[] };
  },
  cards: CardDraw[]
) {
  return cards.reduce((acc, card) => {
    const type = card.isGold ? 'gold' : 'basic';
    const existingFieldIndex = acc.findIndex(
      (x) => x.id === card.cardType.id && x.type === type
    );

    if (existingFieldIndex !== -1) {
      ++acc[existingFieldIndex].count;
      return acc;
    }
    const inventoryLine = userWithInventory.player.playerInventory.find(
      (x) => x.cardTypeId === card.cardType.id && x.type === type
    );

    acc.push({
      id: card.cardType.id,
      type,
      count: inventoryLine ? inventoryLine.total + 1 : 1,
    });
    return acc;
  }, []);
}

export function getCardLostSummary(
  userWithInventory: User & {
    player: Player & { playerInventory: PlayerInventory[] };
  },
  cards: CardDraw[]
) {
  return cards.reduce((acc, card) => {
    const type = card.isGold ? 'gold' : 'basic';
    const existingFieldIndex = acc.findIndex(
      (x) => x.id === card.cardType.id && x.type === type
    );

    if (existingFieldIndex !== -1) {
      --acc[existingFieldIndex].count;
      return acc;
    }
    // inventoryLine should always be present, if not, there is an issue
    const inventoryLine = userWithInventory.player.playerInventory.find(
      (x) => x.cardTypeId === card.cardType.id && x.type === type
    );

    acc.push({
      id: card.cardType.id,
      type,
      count: inventoryLine ? inventoryLine.total - 1 : 0,
    });
    return acc;
  }, []);
}

export function generateSummaryEmbed(
  summary: { id: number; count: number; type: 'basic' | 'gold' }[]
) {
  const snippet = new EmbedBuilder({
    title: `Résumé :`,
  });

  summary
    .sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    })
    .forEach(({ id, count, type }) => {
      snippet.addFields({
        name: `Carte #${id} dans l'inventaire`,
        value: `Type: ${type} | Quantité: x${count}`,
      });
    });

  return snippet;
}
