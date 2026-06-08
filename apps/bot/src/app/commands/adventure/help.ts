import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export const help = async (interaction: ChatInputCommandInteraction) => {
  const embed = new EmbedBuilder()
    .setColor('#0ee8da')
    .setTitle('Help')
    .addFields([{ name: 'join <name>', value: "Rejoint l'aventure" }])
    .addFields([
      { name: 'update <name>', value: 'Met à jour le nom de joueur' },
    ])
    .addFields([{ name: 'inventory', value: 'Affiche son inventaire' }])
    .addFields([
      { name: 'status', value: 'Affiche les stats et objets équipés' },
    ])
    .addFields([{ name: 'equip <id> <slot>', value: 'Equipe un objet' }])
    .addFields([{ name: 'unequip <slot>', value: 'Déséquipe un objet' }])
    .addFields([{ name: 'raid', value: 'Démarre un raid' }])
    .addFields([
      { name: 'move <direction>', value: 'Se déplace dans un donjon' },
    ])
    .addFields([{ name: 'map', value: 'Affiche la carte du donjon' }])
    .addFields([
      { name: 'use <slot>', value: "Utilise l'équipement lors d'un combat" },
    ])
    .addFields([{ name: 'escape', value: 'Tente de fuir un combat' }]);
  return interaction.reply({ embeds: [embed] });
};
