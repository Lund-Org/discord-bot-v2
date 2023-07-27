import { GachaConfigEnum } from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

type PriceConfig = { price: number };

export const help = async (interaction: ChatInputCommandInteraction) => {
  const configPriceJSON = await prisma.config.findUnique({
    where: { name: GachaConfigEnum.PRICE },
  });
  const priceConfig: PriceConfig = configPriceJSON?.value as PriceConfig;
  const snippet = new EmbedBuilder({
    title: 'Liste des commandes disponibles :',
  });
  snippet.addFields({
    name: `/gacha join`,
    value: 'Crée ton profil, à faire la toute première fois pour pouvoir jouer',
  });
  snippet.addFields({
    name: `/gacha daily`,
    value: 'Tire une carte gratuitement, utilisable une fois par jour',
  });
  snippet.addFields({
    name: `/gacha points`,
    value:
      'Permet de savoir combien vous possédez de points pour acheter des cartes',
  });
  snippet.addFields({
    name: `/gacha buy`,
    value: `Permet de dépenser des points pour acheter des cartes. ${priceConfig.price}points par carte`,
  });
  snippet.addFields({
    name: `/gacha cards`,
    value:
      'Permet de voir son inventaire. Utilisez les réactions pour pouvoir changer de page',
  });
  snippet.addFields({
    name: `/gacha gold`,
    value:
      'Permet de sacrifier 5 cartes basiques en une carte dorée du même type',
  });
  snippet.addFields({
    name: `/gacha fusion`,
    value:
      "Permet de créer une carte fusion en sacrifiant ses composants (voir http://lundprod.com pour plus d'infos)",
  });
  snippet.addFields({
    name: `/gacha profile`,
    value: 'Permet de voir son profil',
  });
  snippet.addFields({
    name: `/gacha sell`,
    value: 'Permet de vendre des cartes contre des points',
  });
  snippet.addFields({
    name: `/gacha view`,
    value: "Permet d'avoir l'aperçu d'une carte",
  });
  snippet.addFields({
    name: `/gacha twitch`,
    value: 'Permet de lier son compte Twitch à son profil Gacha',
  });
  snippet.addFields({
    name: `/gacha gift`,
    value: 'Permet de gagner un cadeau',
  });
  return interaction.reply({ embeds: [snippet] });
};
