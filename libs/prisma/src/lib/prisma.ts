import { PrismaClient } from '@prisma/client';
import { SportLeagueExtension } from './extensions/sport-league';
import { UserExtension } from './extensions/user';
import { PlayerInventoryExtension } from './extensions/player-inventory';
import { DiscordNotificationChannelExtension } from './extensions/discord-notification-channel';

const prismaClient = new PrismaClient();

const discordNotificationChannelExtension =
  DiscordNotificationChannelExtension(prismaClient);
const playerInventoryExtension = PlayerInventoryExtension(prismaClient);
const sportLeagueExtension = SportLeagueExtension(prismaClient);
const userExtension = UserExtension(prismaClient);

export const prisma = prismaClient.$extends({
  model: {
    discordNotificationChannel: discordNotificationChannelExtension,
    playerInventory: playerInventoryExtension,
    sportLeague: sportLeagueExtension,
    user: userExtension,
  },
});
