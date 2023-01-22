import { prisma } from '@discord-bot-v2/prisma';
import { CardType } from '@prisma/client';

export type CardTypeWithFusionDependencies = CardType & {
  fusionDependencies: CardType[];
};

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
