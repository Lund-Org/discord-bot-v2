import { ChatInputCommandInteraction } from 'discord.js';
import { userNotFoundWarning } from './helper';
import { prisma } from '@discord-bot-v2/prisma';

export const CARD_PER_PAGE = 10;

export const warn = async (interaction: ChatInputCommandInteraction) => {
  const user = await prisma.user.getPlayer(interaction.user.id);

  if (!user?.player && user.isActive) {
    return userNotFoundWarning(interaction);
  }

  await interaction.deferReply();

  const choice = interaction.options.getBoolean('choice', true);

  await prisma.player.update({
    data: {
      wantToBeWarn: choice,
    },
    where: {
      id: user.player.id,
    },
  });

  return interaction.editReply(
    choice
      ? 'Tu seras prévenu si tu approches de la limite de points'
      : "Tu ne seras plus prévenu à l'avenir"
  );
};
