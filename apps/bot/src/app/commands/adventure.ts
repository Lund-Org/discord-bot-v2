import { directionMapping, slotMapping } from '@discord-bot-v2/common';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

import { equip } from './adventure/equip';
import { escape } from './adventure/escape';
import { help } from './adventure/help';
import { inventory } from './adventure/inventory';
import { join } from './adventure/join';
import { map } from './adventure/map';
import { move } from './adventure/move';
import { raid } from './adventure/raid';
import { status } from './adventure/status';
import { unequip } from './adventure/unequip';
import { update } from './adventure/update';
import { use } from './adventure/use';

const CMD_NAME = 'adventure' as const;

export const adventureCmd = new SlashCommandBuilder()
  .setName(CMD_NAME)
  .setDescription('Commandes du jeu Discord')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('join')
      .setDescription("Rejoint l'aventure")
      .addStringOption((option) =>
        option
          .setName('name')
          .setDescription('Nom du personnage')
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('update')
      .setDescription('Met à jour le nom du personnage')
      .addStringOption((option) =>
        option
          .setName('name')
          .setDescription('Nom du personnage')
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('help')
      .setDescription("Affiche l'aide des différentes commandes"),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('inventory')
      .setDescription("Affiche l'inventaire du joueur"),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('status')
      .setDescription("Affiche l'état du joueur et ses objets équipés"),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('equip')
      .setDescription('Assigne un objet à un slot')
      .addNumberOption((option) =>
        option
          .setName('id')
          .setDescription("Identifiant de l'objet")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('slot')
          .setDescription('Emplacement')
          .setRequired(true)
          .addChoices(
            Object.entries(slotMapping).map(([key, value]) => ({
              name: value,
              value: key,
            })),
          ),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('unequip')
      .setDescription("Retire un objet d'un slot")
      .addStringOption((option) =>
        option
          .setName('slot')
          .setDescription('Emplacement')
          .setRequired(true)
          .addChoices(
            Object.entries(slotMapping).map(([key, value]) => ({
              name: value,
              value: key,
            })),
          ),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('raid')
      .setDescription('Part en aventure')
      .addStringOption((option) =>
        option
          .setName('size')
          .setDescription('Taille du donjon')
          .setRequired(true)
          .addChoices([
            {
              name: 'Petit',
              value: 'sm',
            },
            {
              name: 'Moyen',
              value: 'md',
            },
            {
              name: 'Grand',
              value: 'xl',
            },
          ]),
      )
      .addNumberOption((option) =>
        option
          .setName('level')
          .setDescription('Niveau du donjon')
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('move')
      .setDescription('Se déplace dans un raid dans une direction')
      .addStringOption((option) =>
        option
          .setName('direction')
          .setDescription('Direction où aller')
          .setRequired(true)
          .addChoices(
            Object.entries(directionMapping).map(([key, value]) => ({
              name: value,
              value: key,
            })),
          ),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('map').setDescription('Affiche la carte du raid'),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('use')
      .setDescription("Utilise l'arme ou le consommable")
      .addStringOption((option) =>
        option
          .setName('slot')
          .setDescription('Emplacement')
          .setRequired(true)
          .addChoices(
            Object.entries(slotMapping).map(([key, value]) => ({
              name: value,
              value: key,
            })),
          ),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand.setName('escape').setDescription('Tente de fuir un combat'),
  )
  .toJSON();

export const adventureResponse = {
  type: CMD_NAME,
  callback: adventureCallback,
};

function adventureCallback(interaction: ChatInputCommandInteraction) {
  switch (interaction.options.getSubcommand(true)) {
    case 'join':
      return join(interaction);
    case 'update':
      return update(interaction);
    case 'help':
      return help(interaction);
    case 'inventory':
      return inventory(interaction);
    case 'status':
      return status(interaction);
    case 'equip':
      return equip(interaction);
    case 'unequip':
      return unequip(interaction);
    case 'raid':
      return raid(interaction);
    case 'move':
      return move(interaction);
    case 'map':
      return map(interaction);
    case 'use':
      return use(interaction);
    case 'escape':
      return escape(interaction);
    default:
      return Promise.resolve();
  }
}
