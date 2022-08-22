import { prisma } from '@discord-bot-v2/prisma';
import { ChatInputCommandInteraction } from 'discord.js';
import { userNotFound } from './helper';

export const twitch = async (interaction: ChatInputCommandInteraction) => {
  const player = await userNotFound({ interaction });

  if (!player) {
    return;
  }

  const twitchUsername = interaction.options.getString('username', true);

  try {
    await prisma.player.update({
      where: { id: player.id },
      data: {
        twitchUsername: twitchUsername.toLowerCase(),
      },
    });
    interaction.reply(`Pseudo twitch attaché`);
  } catch (e) {
    interaction.reply(
      `Une erreur s'est produite lors de l'enregistrement du pseudo Twitch`
    );
  }
};
