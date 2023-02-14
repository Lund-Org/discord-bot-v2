import { ChannelNotification, PrismaClient } from '@prisma/client';

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
  getFootballChannelId: async (): Promise<string> => {
    const channel = await prisma.discordNotificationChannel.findUnique({
      where: {
        notificationType: ChannelNotification.FOOTBALL,
      },
    });

    return channel?.discordChannelId || '';
  },
  getNBAChannelId: async (): Promise<string> => {
    const channel = await prisma.discordNotificationChannel.findUnique({
      where: {
        notificationType: ChannelNotification.NBA,
      },
    });

    return channel?.discordChannelId || '';
  },
  getMotorsportChannelId: async (): Promise<string> => {
    const channel = await prisma.discordNotificationChannel.findUnique({
      where: {
        notificationType: ChannelNotification.MOTORSPORT,
      },
    });

    return channel?.discordChannelId || '';
  },
});
