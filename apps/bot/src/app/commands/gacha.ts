import { SlashCommandBuilder } from '@discordjs/builders';
import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  SelectMenuInteraction,
} from 'discord.js';

import { buy } from './gacha/buy';
import { cards } from './gacha/cards';
import { daily } from './gacha/daily';
import { dismantle } from './gacha/dismantle';
import { fusion, fusionMenu } from './gacha/fusion';
import { gift } from './gacha/gift';
import { gold } from './gacha/gold';
import { help } from './gacha/help';
import { join } from './gacha/join';
import { points } from './gacha/points';
import { profile } from './gacha/profile';
import { sell } from './gacha/sell';
import { shopBuy } from './gacha/shop-buy';
import { twitch } from './gacha/twitch';
import { view } from './gacha/view';
import { warn } from './gacha/warn';

const CMD_NAME = 'gacha' as const;

export const gachaCmd = new SlashCommandBuilder()
  .setName(CMD_NAME)
  .setDescription('Commande pour jouer au gacha')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('buy')
      .setDescription("Permet d'acheter des cartes")
      .addNumberOption((option) =>
        option
          .setName('quantity')
          .setDescription('Nombre de cartes à acheter')
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('cards').setDescription('Permet de voir son inventaire')
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('daily').setDescription('Récupérer sa carte quotidienne')
  )
  .addSubcommand(
    (subcommand) =>
      subcommand
        .setName('fusion')
        .setDescription('Permet de fusionner des cartes')
    // Menu
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('gift')
      .setDescription('Permet de récupérer un cadeau')
      .addStringOption((option) =>
        option
          .setName('code')
          .setDescription('Code du cadeau')
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('gold')
      .setDescription('Permet de transformer des cartes basiques en or')
      .addNumberOption((option) =>
        option
          .setName('id')
          .setDescription('Identifiant de la carte')
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('dismantle')
      .setDescription('Permet de transformer un carte en or en carte basique')
      .addNumberOption((option) =>
        option
          .setName('id')
          .setDescription('Identifiant de la carte')
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('help').setDescription('Affiche une aide')
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('join').setDescription('Commande pour créer son compte')
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('points')
      .setDescription('Permet de voir son nombre de points')
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('profile')
      .setDescription("Permet d'avoir les infos de son profil")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('sell')
      .setDescription('Permet de vendre des cartes')
      .addNumberOption((option) =>
        option
          .setName('id')
          .setDescription('Identifiant de la carte')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('type')
          .setDescription('Type de carte')
          .setRequired(true)
          .addChoices(
            { name: 'Carte basique', value: 'basic' },
            { name: 'Carte dorée', value: 'gold' }
          )
      )
      .addNumberOption((option) =>
        option
          .setName('quantity')
          .setDescription('Quantité de cartes à vendre')
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('twitch')
      .setDescription('Permet de lier son compte Twitch au gacha')
      .addStringOption((option) =>
        option
          .setName('username')
          .setDescription('Nom du compte twitch')
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('view')
      .setDescription('Affiche une carte')
      .addNumberOption((option) =>
        option
          .setName('id')
          .setDescription('Identifiant de la carte')
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('warn')
      .setDescription('Prévient si le joueur approche de la limite de points')
      .addBooleanOption((option) =>
        option
          .setName('choice')
          .setDescription("Le choix si l'utilisateur veut être prévenu ou non")
          .setRequired(true)
      )
  )
  .toJSON();

export const gachaResponse = {
  type: CMD_NAME,
  callback: gachaCallback,
};

function gachaCallback(interaction: ChatInputCommandInteraction) {
  switch (interaction.options.getSubcommand(true)) {
    case 'buy':
      return buy(interaction);
    case 'cards':
      return cards(interaction);
    case 'daily':
      return daily(interaction);
    case 'dismantle':
      return dismantle(interaction);
    case 'fusion':
      return fusionMenu(interaction);
    case 'gift':
      return gift(interaction);
    case 'gold':
      return gold(interaction);
    case 'help':
      return help(interaction);
    case 'join':
      return join(interaction);
    case 'points':
      return points(interaction);
    case 'profile':
      return profile(interaction);
    case 'sell':
      return sell(interaction);
    case 'twitch':
      return twitch(interaction);
    case 'view':
      return view(interaction);
    case 'warn':
      return warn(interaction);
    default:
      return Promise.resolve();
  }
}

export async function gachaMenuResponse(interaction: SelectMenuInteraction) {
  switch (interaction.customId) {
    case 'fusion':
      return fusion(interaction);
    default:
      return Promise.resolve();
  }
}

export async function gachaButtonResponse(interaction: ButtonInteraction) {
  if (interaction.customId.startsWith('shopbuy-')) {
    return shopBuy(interaction);
  }
  return Promise.resolve();
}
