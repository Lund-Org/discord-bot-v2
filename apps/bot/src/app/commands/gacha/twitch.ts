import { prisma } from '@discord-bot-v2/prisma';
import { ChatInputCommandInteraction } from 'discord.js';
import { invalidateWebsitePages } from '../../helpers/discordEvent';
import { userNotFoundWarning } from './helper';

export const twitch = async (interaction: ChatInputCommandInteraction) => {
  const user = await prisma.user.getPlayer(interaction.user.id);

  if (!user?.player) {
    return userNotFoundWarning(interaction);
  }

  const twitchUsername = interaction.options.getString('username', true);

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twitchUsername: twitchUsername.toLowerCase(),
      },
    });
    invalidateWebsitePages(user.discordId);
    interaction.reply(`Pseudo twitch attaché`);
  } catch (e) {
    interaction.reply(
      `Une erreur s'est produite lors de l'enregistrement du pseudo Twitch`
    );
  }
};
