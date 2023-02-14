import { prisma } from '@discord-bot-v2/prisma';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

const UNFOLLOW_ERROR_MESSAGE = "Une erreur est survenue lors de l'unfollow";
const NOT_FOUND_ERROR_MESSAGE =
  "L'identifiant de l'équipe que tu souhaites unfollow n'existe pas";

function getErrorEmbed(msg) {
  return new EmbedBuilder()
    .setColor(0xf44336)
    .setTitle('Echec !')
    .setDescription(msg);
}

export async function unfollowTeam(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const teamId = interaction.options.getNumber('teamid', true);
  const team = await prisma.sportTeam.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    return interaction.editReply({
      embeds: [getErrorEmbed(NOT_FOUND_ERROR_MESSAGE)],
    });
  }

  try {
    await prisma.sportTeam.update({
      where: { id: teamId },
      data: {
        users: {
          disconnect: {
            discordId: interaction.user.id,
          },
        },
      },
    });
  } catch (e) {
    return interaction.editReply({
      embeds: [getErrorEmbed(UNFOLLOW_ERROR_MESSAGE)],
    });
  }

  const embed = new EmbedBuilder()
    .setColor(0x3eaf7c)
    .setTitle('Succès !')
    .setThumbnail(team.logoUrl)
    .setDescription(`Equipe '${team.name}' unfollow avec succès`);

  return interaction.editReply({ embeds: [embed] });
}
