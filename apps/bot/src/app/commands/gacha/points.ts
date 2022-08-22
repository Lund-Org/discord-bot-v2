import { ChatInputCommandInteraction } from 'discord.js';
import { userNotFound } from './helper';

export const points = async (interaction: ChatInputCommandInteraction) => {
  const player = await userNotFound({ interaction });

  if (!player) {
    return;
  }

  interaction.reply(`Tu possèdes actuellement ${player.points} points`);
};
