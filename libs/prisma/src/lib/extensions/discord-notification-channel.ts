import { ChannelNotification, PrismaClient } from '@discord-bot-v2/prisma';

export const DiscordNotificationChannelExtension = (prisma: PrismaClient) => ({
  getBirthdayChannelId: async (): Promise<string> => {
    const channel = await prisma.discordNotificationChannel.findUnique({
      where: {
        notificationType: ChannelNotification.BIRTHDAY,
      },
    });

    return channel?.discordChannelId || '';
  },
  getMemeChannelId: async (): Promise<string> => {
    const channel = await prisma.discordNotificationChannel.findUnique({
      where: {
        notificationType: ChannelNotification.MEME,
      },
    });

    return channel?.discordChannelId || '';
  },
  getShopChannelId: async (): Promise<string> => {
    const channel = await prisma.discordNotificationChannel.findUnique({
      where: {
        notificationType: ChannelNotification.SHOP,
      },
    });

    return channel?.discordChannelId || '';
  },
});
