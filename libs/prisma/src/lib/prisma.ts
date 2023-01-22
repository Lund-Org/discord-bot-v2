import { PrismaClient } from '@prisma/client';
import { getPlayerExtensions } from './extensions/player';
import { getPlayerInventoryExtensions } from './extensions/player-inventory';

const prismaClient = new PrismaClient();

export const prisma = prismaClient.$extends({
  model: {
    player: getPlayerExtensions(prismaClient),
    playerInventory: getPlayerInventoryExtensions(prismaClient),
  },
});
