import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

const CMD_NAME_6 = 'roll6' as const;
const CMD_NAME_20 = 'roll20' as const;
const CMD_NAME_100 = 'roll100' as const;

export const roll6Cmd = new SlashCommandBuilder()
  .setName(CMD_NAME_6)
  .setDescription('Lance un dé 6')
  .toJSON();
export const roll20Cmd = new SlashCommandBuilder()
  .setName(CMD_NAME_20)
  .setDescription('Lance un dé 20')
  .toJSON();
export const roll100Cmd = new SlashCommandBuilder()
  .setName(CMD_NAME_100)
  .setDescription('Lance un dé 100')
  .toJSON();

export const roll6Response = {
  type: CMD_NAME_6,
  callback: roll6Callback,
};
export const roll20Response = {
  type: CMD_NAME_20,
  callback: roll20Callback,
};
export const roll100Response = {
  type: CMD_NAME_100,
  callback: roll100Callback,
};

function roll6Callback(interaction: ChatInputCommandInteraction) {
  const roll = Math.ceil(Math.random() * 6);

  return interaction.reply(`:game_die: ${roll} (1 - 6)`);
}

function roll20Callback(interaction: ChatInputCommandInteraction) {
  const roll = Math.ceil(Math.random() * 20);

  return interaction.reply(`:game_die: ${roll} (1 - 20)`);
}

function roll100Callback(interaction: ChatInputCommandInteraction) {
  const roll = Math.ceil(Math.random() * 100);

  return interaction.reply(`:game_die: ${roll} (1 - 100)`);
}
