import { giftPointsForBirthday } from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

const months = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Aout',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

const CMD_NAME = 'birthday' as const;

export const birthdayCmd = new SlashCommandBuilder()
  .setName(CMD_NAME)
  .setDescription("Enregistre sa date d'anniversaire")
  .addNumberOption((option) =>
    option
      .setName('day')
      .setDescription('Le jour de naissance')
      .setRequired(true)
  )
  .addNumberOption((option) => {
    const opt = option
      .setName('month')
      .setDescription('Le mois de naissance')
      .setRequired(true);
    const choices = Array.from(Array(12).keys()).map((n) => ({
      name: months[n],
      value: n + 1,
    }));

    return opt.addChoices(...choices);
  })
  .addNumberOption((option) =>
    option
      .setName('year')
      .setDescription("L'année de naissance")
      .setRequired(true)
  )
  .toJSON();

export const birthdayResponse = {
  type: CMD_NAME,
  callback: birthdayCallback,
};

async function birthdayCallback(interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id;
  const day = interaction.options.getNumber('day', true);
  const month = interaction.options.getNumber('month', true);
  const year = interaction.options.getNumber('year', true);

  if (!checkValidDate(day, month, year)) {
    return interaction.reply(`La date est invalide`);
  }

  try {
    const newBirthday = await prisma.birthday.upsert({
      where: { discordId: userId },
      update: {
        birthdayDay: day,
        birthdayMonth: month,
        birthdayYear: year,
      },
      create: {
        discordId: userId,
        birthdayDay: day,
        birthdayMonth: month,
        birthdayYear: year,
      },
    });
    interaction.reply(`Anniversaire enregistré !`);
    if (newBirthday) {
      await backportThisYearPoints(day, month, userId);
    }
  } catch (e) {
    console.log(e);
    interaction.reply(
      `Une erreur est arrivée lors de la sauvegarde de l'anniversaire`
    );
  }
}

async function backportThisYearPoints(
  day: number,
  month: number,
  discordId: string
) {
  const birthdayThisYear = new Date(new Date().getFullYear(), month - 1, day);

  if (birthdayThisYear.getTime() < Date.now()) {
    const user = await prisma.user.findFirst({
      include: { player: true },
      where: { discordId, isActive: true },
    });

    if (user?.player && user.isActive) {
      await giftPointsForBirthday(discordId);
    }
  }
}

function checkValidDate(day: number, month: number, year: number) {
  const date = new Date(year, month - 1, day);

  return (
    date instanceof Date &&
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
}
