import { PrismaClient } from '@prisma/client';

export const UserExtension = (prisma: PrismaClient) => ({
  getPlayer: async (discordId: string) => {
    const user = await prisma.user.findFirst({
      include: {
        gachaPlayer: true,
      },
      where: { discordId, isActive: true },
    });

    return user?.gachaPlayer && user.isActive ? user : null;
  },

  getPlayerWithInventory: async (discordId: string) => {
    const user = await prisma.user.findFirst({
      include: {
        gachaPlayer: {
          include: {
            gachaPlayerInventory: {
              include: {
                cardType: true,
              },
            },
          },
        },
      },
      where: { discordId, isActive: true },
    });

    return user?.gachaPlayer && user.isActive ? user : null;
  },

  getProfile: async (discordId: string) => {
    return prisma.user.findUnique({
      include: {
        gachaPlayer: {
          include: {
            gachaPlayerInventory: {
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
