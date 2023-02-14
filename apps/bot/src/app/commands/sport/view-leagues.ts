import { prisma } from '@discord-bot-v2/prisma';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export const viewLeagues = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply({ ephemeral: true });

  const leagues = await prisma.sportLeague.getLastYearLeagues();

  const embeds = leagues.map((league) => {
    return new EmbedBuilder()
      .setAuthor({
        name: league.name,
        iconURL: league.logoUrl,
      })
      .setDescription(`Saison ${league.year}`)
      .addFields([{ name: 'Identifiant', value: league.id.toString() }]);
  });

  return interaction.editReply({ embeds });
};
