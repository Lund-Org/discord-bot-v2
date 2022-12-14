import { ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js';
import {
  addCardsToInventory,
  drawCards,
  invalidateWebsitePages,
} from './helper';
import { givenPointsForBirthday } from '@discord-bot-v2/common';
import { generateDrawImage } from '../../helpers/canvas';
import { prisma } from '@discord-bot-v2/prisma';

async function hasBirthdayAndBeforeDate(discordId: string) {
  const birthday = await prisma.birthday.findUnique({
    where: { discordId },
  });

  if (!birthday) {
    return false;
  }

  const birthdayThisYear = new Date(
    new Date().getFullYear(),
    birthday.birthdayMonth - 1,
    birthday.birthdayDay
  );

  return birthdayThisYear.getTime() < Date.now();
}

export const join = async (interaction: ChatInputCommandInteraction) => {
  const userId = interaction.user.id;
  const player = await prisma.player.findUnique({
    where: { discordId: userId },
  });

  if (player) {
    return interaction.reply('Ton compte existe déjà');
  }

  await interaction.deferReply();
  try {
    const birthdayBonus = await hasBirthdayAndBeforeDate(userId);

    const player = await prisma.player.create({
      data: {
        username: interaction.user.username,
        discordId: userId,
        points: birthdayBonus ? givenPointsForBirthday : 0,
        lastMessageDate: new Date(),
        lastDailyDraw: null,
        joinDate: new Date(),
      },
      include: {
        playerInventory: true,
      },
    });

    const cards = await drawCards(8);
    const canvas = await generateDrawImage(interaction.user.username, cards);
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: 'cards.png',
    });

    await addCardsToInventory(player, cards, 0);
    invalidateWebsitePages(player.discordId);
    return interaction.editReply({
      content: `Bienvenue dans le gacha, voici tes 8 premières cartes ! ${
        birthdayBonus
          ? `Ton anniversaire étant passé, tu as gagné ${givenPointsForBirthday} points bonus`
          : ''
      }`,
      files: [attachment],
    });
  } catch (e) {
    console.log(e);
    return interaction.editReply(
      'Une erreur est survenue lors de la création du compte'
    );
  }
};
