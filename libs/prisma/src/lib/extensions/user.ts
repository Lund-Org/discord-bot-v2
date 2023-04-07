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
    return prisma.user.findUnique({
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
      where: { discordId, isActive: true },
    });
  },
});
