import {
  ChannelType,
  Client,
  Guild,
  Collection,
  GuildBasedChannel,
} from 'discord.js';
import { DataStore } from '@discord-bot-v2/common';

export default function (client: Client) {
  const servers: Collection<string, Guild> = client.guilds.cache;

  servers.every((server: Guild): boolean => {
    const hasMemeChannel = !!server.channels.cache.find(
      (channel: GuildBasedChannel) => {
        return channel.id === process.env.MEME_CHANNEL_ID;
      }
    );

    if (!hasMemeChannel && process.env.MEME_CHANNEL_NAME) {
      server.channels
        .create({
          name: process.env.MEME_CHANNEL_NAME,
          type: ChannelType.GuildText,
        })
        .then((newChannel) => {
          DataStore.setData('MEME_CHANNEL_ID', newChannel.id);
        });
    } else if (!hasMemeChannel) {
      console.log('Memes variables not set in the .env');
    } else {
      DataStore.setData('MEME_CHANNEL_ID', process.env.MEME_CHANNEL_ID || '');
    }
    return true;
  });
}
