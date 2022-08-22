import { ChatInputCommandInteraction, SelectMenuInteraction } from 'discord.js';
import { GachaConfigEnum } from '../../enums/GachaEnum';
import { CardType, Player, PlayerInventory, Prisma } from '@prisma/client';
import { prisma } from '@discord-bot-v2/prisma';
import { addPoints } from '@discord-bot-v2/common';
import { CardDraw } from '../../helpers/types';

type ChancesConfig = {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
};

export const userNotFound = async ({
  interaction,
  withWarning = true,
  relations = {},
}: {
  interaction: ChatInputCommandInteraction | SelectMenuInteraction;
  withWarning?: boolean;
  relations?: Prisma.PlayerInclude;
}) => {
  const hasRelationsIncluded = Object.keys(relations).length > 0;
  const userId = interaction.user.id;
  const player = await prisma.player.findUnique({
    where: { discordId: userId },
    ...(hasRelationsIncluded ? { include: relations } : {}),
  });

  if (player) {
    return player;
  }

  if (withWarning) {
    interaction.reply(
      `Avant de pouvoir jouer, crée un compte avec la commande "/gacha join"`
    );
  }
  return null;
};

export async function addCardsToInventory(
  player: Player & { playerInventory: PlayerInventory[] },
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
    const inventoryItem = player.playerInventory.find(
      (x) => x.cardTypeId === cardToAdd.cardType.id && x.type === type
    );
    const existingItem =
      groupedPlayerInventoryItems[
        `${type}-${cardToAdd.cardType.id}-${player.id}`
      ];

    if (existingItem && !isNewItem(existingItem)) {
      existingItem.incr++;
    } else if (inventoryItem) {
      groupedPlayerInventoryItems[
        `${type}-${cardToAdd.cardType.id}-${player.id}`
      ] = {
        id: inventoryItem.id,
        incr: 1,
      };
    } else {
      groupedPlayerInventoryItems[
        `${type}-${cardToAdd.cardType.id}-${player.id}`
      ] = {
        playerId: player.id,
        total: 1,
        type,
        cardTypeId: cardToAdd.cardType.id,
      };
    }
  });

  await Promise.all([
    addPoints(player.id, -totalPrice),
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
