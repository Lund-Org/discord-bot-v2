import { prisma } from '@discord-bot-v2/prisma';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

const FOLLOW_ERROR_MESSAGE = 'Une erreur est survenue lors du follow';
const NOT_FOUND_ERROR_MESSAGE =
  "L'identifiant de l'équipe que tu souhaites follow n'existe pas";

function getErrorEmbed(msg) {
  return new EmbedBuilder()
    .setColor(0xf44336)
    .setTitle('Echec !')
    .setDescription(msg);
}

export async function followTeam(interaction: ChatInputCommandInteraction) {
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
          connect: {
            discordId: interaction.user.id,
          },
        },
      },
    });
  } catch (e) {
    return interaction.editReply({
      embeds: [getErrorEmbed(FOLLOW_ERROR_MESSAGE)],
    });
  }

  const embed = new EmbedBuilder()
    .setColor(0x3eaf7c)
    .setTitle('Succès !')
    .setThumbnail(team.logoUrl)
    .setDescription(`Equipe '${team.name}' follow avec succès`);

  return interaction.editReply({ embeds: [embed] });
}
