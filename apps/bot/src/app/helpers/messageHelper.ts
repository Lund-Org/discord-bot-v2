import { prisma } from '@discord-bot-v2/prisma';
import { ChannelType, Client, Message, TextChannel } from 'discord.js';
import { extname } from 'path';
import { parse, UrlWithStringQuery } from 'url';

export default {
  /**
   * Function to add security and ignore self message sent by the bot
   * @param client The bot client
   * @param msg The message to react with
   */
  ignoreSelfMessage(client: Client, msg: Message): Promise<boolean> {
    return Promise.resolve(msg.author?.id !== client.user?.id);
  },
  /**
   * Check if a message is an url
   * @param msg The message to analyse
   */
  isUrl(msg: Message): boolean {
    const parsedUrl: UrlWithStringQuery = parse(msg.content);

    return (
      !!parsedUrl.protocol &&
      (parsedUrl.protocol.includes('http') ||
        parsedUrl.protocol.includes('https'))
    );
  },
  /**
   * Check if the message is in the meme channel
   * @param msg The message to analyse
   */
  async isMemeChannel(msg: Message): Promise<boolean> {
    const MemeChannelId =
      await prisma.discordNotificationChannel.getMemeChannelId();

    if (msg.channel.type === ChannelType.GuildText) {
      const channel: TextChannel = msg.channel as TextChannel;

      return channel.id === MemeChannelId;
    }
    return false;
  },
  /**
   * Check if the argument is has a valid extension
   * @param url The url to analyse
   */
  isValidImageFormat(url: string): boolean {
    const authorizedExtension = ['.jpg', '.jpeg', '.gif', '.png', '.bmp'];
    const parsedUrl: UrlWithStringQuery = parse(url);

    return (
      !!parsedUrl.pathname &&
      authorizedExtension.includes(extname(parsedUrl.pathname))
    );
  },
  /**
   * Check if the url is included in the whitelist
   * @param url The url to analyse
   * @param whitelist The list of the valid hostnames
   */
  isWhitelistedHostname(url: string, whitelist: string[]): boolean {
    const parsedUrl: UrlWithStringQuery = parse(url);

    return (
      !!parsedUrl.hostname &&
      whitelist.reduce((accumulator, hostname) => {
        return accumulator || !!parsedUrl.hostname?.endsWith(hostname);
      }, false)
    );
  },
};
