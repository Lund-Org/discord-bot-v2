import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export const help = async (interaction: ChatInputCommandInteraction) => {
  const snippet = new EmbedBuilder({
    title: 'Liste des commandes disponibles :',
  });
  snippet.addFields({
    name: `/sport followleague <league id>`,
    value:
      "Permet de suivre toute une league et être notifié lors d'un evenement",
  });
  snippet.addFields({
    name: `/sport followteam <team id>`,
    value:
      "Permet de suivre une équipe et être notifié lors d'une evenemnt où elle est présente",
  });
  snippet.addFields({
    name: `/sport unfollowleague <league id>`,
    value: 'Permet de ne plus suivre une league',
  });
  snippet.addFields({
    name: `/sport unfollowteam <team id>`,
    value: 'Permet de ne plus suivre une équipe',
  });
  snippet.addFields({
    name: `/sport viewleagues`,
    value: 'Permet de voir les identifiants des ligues',
  });
  snippet.addFields({
    name: `/sport viewteams <league id>`,
    value: "Permet de voir les identifiants des équipes d'une ligue",
  });
  return interaction.reply({ embeds: [snippet] });
};
