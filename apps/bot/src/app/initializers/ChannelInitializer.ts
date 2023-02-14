import {
  ChannelType,
  Client,
  Guild,
  Collection,
  GuildBasedChannel,
} from 'discord.js';
import { prisma } from '@discord-bot-v2/prisma';
import { ChannelNotification } from '@prisma/client';

export async function ChannelInitializer(client: Client) {
  const servers: Collection<string, Guild> = client.guilds.cache;
  const MemeChannelId =
    await prisma.discordNotificationChannel.getMemeChannelId();

  servers.every((server: Guild): boolean => {
    const hasMemeChannel = !!server.channels.cache.find(
      (channel: GuildBasedChannel) => {
        return channel.id === MemeChannelId;
      }
    );

    if (!hasMemeChannel && process.env.MEME_CHANNEL_NAME) {
      server.channels
        .create({
          name: process.env.MEME_CHANNEL_NAME,
          type: ChannelType.GuildText,
        })
        .then((newChannel) =>
          prisma.discordNotificationChannel.create({
            data: {
              discordChannelId: newChannel.id,
              notificationType: ChannelNotification.MEME,
            },
          })
        );
    } else if (!hasMemeChannel) {
      console.log('Memes variables not set in the .env');
    }

    return true;
  });
}
