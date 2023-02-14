import { prisma } from '@discord-bot-v2/prisma';
import { ChatInputCommandInteraction, inlineCode } from 'discord.js';

export const viewTeams = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply({ ephemeral: true });
  const leagueId = interaction.options.getNumber('leagueid', true);
  const league = await prisma.sportLeague.findUnique({
    where: { id: leagueId },
  });

  if (!league) {
    return interaction.reply("La ligue n'existe pas");
  }

  const teams = await prisma.sportTeam.findMany({
    where: { league: { some: { id: leagueId } } },
    orderBy: {
      name: 'asc',
    },
  });

  return interaction.editReply(
    teams
      .map((team) => `• ${team.name} ${inlineCode('#' + team.id)}`)
      .join('\n')
  );
};
