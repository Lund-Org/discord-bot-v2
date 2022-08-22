import { prisma } from '@discord-bot-v2/prisma';
import { CardType } from '@prisma/client';

type CardTypeWithFusionDependencies = CardType & {
  fusionDependencies: CardType[];
};

export async function getCardsToGold(discordId: string) {
  try {
    return prisma.playerInventory.findMany({
      where: {
        player: { discordId },
        type: 'basic',
        total: { gte: 5 },
      },
      include: { player: true, cardType: true },
      orderBy: { cardType: { id: 'asc' } },
    });
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function getCardsToFusion(discordId: string) {
  try {
    const fusionCards = await prisma.cardType.findMany({
      where: { isFusion: 1 },
      include: {
        fusionDependencies: true,
      },
    });
    const inventoryCards = await prisma.playerInventory.findMany({
      include: {
        player: true,
        cardType: true,
      },
      where: {
        player: { discordId },
        type: 'basic',
      },
    });

    return fusionCards.reduce((accumulator, fusionCard) => {
      const depsIds = fusionCard.fusionDependencies.map((f) => f.id);
      const hasAllDeps = depsIds.every((depId) => {
        return inventoryCards.find(
          (inventoryCard) =>
            inventoryCard.cardType.id === depId && inventoryCard.total > 0
        );
      });

      return hasAllDeps ? [...accumulator, fusionCard] : accumulator;
    }, [] as CardTypeWithFusionDependencies[]);
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function getProfile(discordId: string) {
  try {
    let player = await prisma.player.findFirst({
      include: {
        playerInventory: {
          include: {
            cardType: true,
          },
          orderBy: {
            cardTypeId: 'asc',
          },
        },
      },
      where: {
        discordId,
        playerInventory: {
          some: {
            total: { gt: 0 },
          },
        },
      },
    });

    if (!player) {
      player = await prisma.player.findUnique({
        where: { discordId },
        include: {
          playerInventory: {
            include: {
              cardType: true,
            },
          },
        },
      });

      if (player) {
        player.playerInventory = [];
      }
    }

    return player;
  } catch (e) {
    console.log(e);
    return null;
  }
}
