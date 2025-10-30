import { PrismaClient } from '@prisma/client';

export const PlayerInventoryExtension = (prisma: PrismaClient) => ({
  getCardsToGold: async (discordId: string) => {
    try {
      return prisma.playerInventory.findMany({
        where: {
          player: {
            user: { discordId },
          },
          type: 'basic',
          total: { gte: 5 },
        },
        include: { cardType: true },
        orderBy: { cardType: { id: 'asc' } },
      });
    } catch (e) {
      console.log(e);
      return Promise.resolve([]);
    }
  },
});
