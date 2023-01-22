import { PrismaClient } from '@prisma/client';

export const getPlayerInventoryExtensions = (prisma: PrismaClient) => ({
  getCardsToGold(discordId: string) {
    try {
      return prisma.playerInventory.findMany({
        where: {
          player: { discordId },
          type: 'basic',
          total: { gte: 5 },
        },
        include: { cardType: true },
        orderBy: { cardType: { id: 'asc' } },
      });
    } catch (e) {
      console.log(e);
      return [];
    }
  },
});
