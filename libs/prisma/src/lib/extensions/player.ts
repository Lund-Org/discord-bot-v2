import { PrismaClient } from '@prisma/client';

export const getPlayerExtensions = (prisma: PrismaClient) => ({
  async getProfile(discordId: string) {
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
  },
});
