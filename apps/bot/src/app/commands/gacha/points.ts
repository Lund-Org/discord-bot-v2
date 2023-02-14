import { prisma } from '@discord-bot-v2/prisma';
import { ChatInputCommandInteraction } from 'discord.js';
import { userNotFoundWarning } from './helper';

export const points = async (interaction: ChatInputCommandInteraction) => {
  const user = await prisma.user.getPlayer(interaction.user.id);

  if (!user?.player) {
    return userNotFoundWarning(interaction);
  }

  interaction.reply(`Tu possèdes actuellement ${user.player.points} points`);
};
