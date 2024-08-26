import { PrismaClient } from '@prisma/client';

import { DiscordNotificationChannelExtension } from './extensions/discord-notification-channel';
import { PlayerInventoryExtension } from './extensions/player-inventory';
import { UserExtension } from './extensions/user';

// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
const prismaClientSingleton = () => {
  const prismaClient = new PrismaClient();

  const discordNotificationChannelExtension =
    DiscordNotificationChannelExtension(prismaClient);
  const playerInventoryExtension = PlayerInventoryExtension(prismaClient);
  const userExtension = UserExtension(prismaClient);

  return prismaClient.$extends({
    model: {
      discordNotificationChannel: discordNotificationChannelExtension,
      playerInventory: playerInventoryExtension,
      user: userExtension,
    },
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export { prisma };

if (process.env['NODE_ENV'] !== 'production') {
  globalThis.prisma = prisma;
}
