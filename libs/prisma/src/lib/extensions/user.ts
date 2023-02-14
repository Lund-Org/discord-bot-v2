import { PrismaClient } from '@prisma/client';

export const UserExtension = (prisma: PrismaClient) => ({
  getPlayer: async (discordId: string) => {
    const user = await prisma.user.findFirst({
      include: {
        player: true,
      },
      where: { discordId, isActive: true },
    });

    return user?.player && user.isActive ? user : null;
  },

  getPlayerWithInventory: async (discordId: string) => {
    const user = await prisma.user.findFirst({
      include: {
        player: {
          include: {
            playerInventory: {
              include: {
                cardType: true,
              },
            },
          },
        },
      },
      where: { discordId, isActive: true },
    });

    return user?.player && user.isActive ? user : null;
  },

  getProfile: async (discordId: string) => {
    const userPlayer = await prisma.user.findUnique({
      include: {
        player: true,
      },
      where: { discordId },
    });

    if (!userPlayer?.player) {
      return null;
    }

    try {
      let user = await prisma.user.findFirst({
        include: {
          player: {
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
          },
        },
        where: {
          discordId,
          isActive: true,
          player: {
            playerInventory: {
              some: {
                total: { gt: 0 },
              },
            },
          },
        },
      });

      if (!user) {
        user = await prisma.user.findFirst({
          where: { discordId, isActive: true },
          include: {
            player: {
              include: {
                playerInventory: {
                  include: {
                    cardType: true,
                  },
                },
              },
            },
          },
        });

        if (user) {
          user.player!.playerInventory = [];
        }
      }

      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
