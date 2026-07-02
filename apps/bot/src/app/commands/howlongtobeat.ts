import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

type HLTBCode = 'gameplayMain' | 'gameplayMainExtra' | 'gameplayCompletionist';
const HLTBLabelCode: [HLTBCode, string][] = [
  ['gameplayMain', 'Main Story'],
  ['gameplayMainExtra', 'Main + Extras'],
  ['gameplayCompletionist', 'Completionist'],
];
const CMD_NAME = 'howlongtobeat' as const;

export const howlongtobeatCmd = new SlashCommandBuilder()
  .setName(CMD_NAME)
  .setDescription('Récupère les informations de durée de vie pour un jeu')
  .addStringOption((option) =>
    option.setName('name').setDescription('Le nom du jeu').setRequired(true),
  )
  .toJSON();

export const howlongtobeatResponse = {
  type: CMD_NAME,
  callback: howlongtobeatCallback,
};

async function howlongtobeatCallback(interaction: ChatInputCommandInteraction) {
  // const hltbService = new HowLongToBeatService();
  const name = interaction.options.getString('name', true);

  // try {
  //   const searchResult = await hltbService.search(name);

  //   if (searchResult) {
  //     const embed = new EmbedBuilder()
  //       .setColor('#0ee8da')
  //       .setTitle(searchResult.name)
  //       .setThumbnail(searchResult.imageUrl);

  //     HLTBLabelCode.forEach(([code, label]) => {
  //       const value = searchResult[code];

  //       if (value) {
  //         embed.addFields([{ name: label, value }]);
  //       }
  //     });

  //     return interaction.reply({ embeds: [embed] });
  //   } else if (typeof searchResult === 'undefined') {
  //     return interaction.reply({
  //       content: `Aucun résultat trouvé, peut-être dû à un probleme interne, vous pouvez tout de même aller voir sur https://howlongtobeat.com/?q=${encodeURI(
  //         name,
  //       )}`,
  //     });
  //   }

  return interaction.reply(
    `Infos disponible ici https://howlongtobeat.com/?q=${encodeURI(
      name,
    )} ||(solution temporaire, j'en ai marre de réparer l'accès à leur donnée)||`,
  );
  // } catch (e) {
  //   return interaction.reply('Une erreur est survenue');
  // }
}
