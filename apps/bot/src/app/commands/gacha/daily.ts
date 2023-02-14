import { prisma } from '@discord-bot-v2/prisma';
import { Player } from '@prisma/client';
import { ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js';
import { generateDrawImage } from '../../helpers/canvas';
import { invalidateWebsitePages } from '../../helpers/discordEvent';
import {
  addCardsToInventory,
  drawCards,
  generateSummaryEmbed,
  getCardEarnSummary,
  userNotFoundWarning,
} from './helper';

function canDrawCard(player: Player): boolean {
  const beginningOfTheDay = new Date();
  beginningOfTheDay.setHours(0, 0, 0, 0);

  return player.lastDailyDraw
    ? new Date(player.lastDailyDraw).getTime() <= beginningOfTheDay.getTime()
    : true;
}

async function setDailyDraw(date: Date, playerId: number) {
  return prisma.player.update({
    where: { id: playerId },
    data: {
      lastDailyDraw: date,
    },
  });
}

export const daily = async (interaction: ChatInputCommandInteraction) => {
  const user = await prisma.user.getPlayerWithInventory(interaction.user.id);
  const dailyDrawDate = new Date();

  if (!user?.player) {
    return userNotFoundWarning(interaction);
  }

  await interaction.deferReply();
  const drawPossible = canDrawCard(user.player);

  if (drawPossible) {
    const cards = await drawCards(1);
    const canvas = await generateDrawImage(interaction.user.username, cards);
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: 'cards.png',
    });
    const embed = generateSummaryEmbed(getCardEarnSummary(user, cards));

    await addCardsToInventory(user, cards, 0);
    await setDailyDraw(dailyDrawDate, user.player.id);
    invalidateWebsitePages(user.discordId);
    interaction.editReply({
      content: `Voici ton tirage quotidien GRA-TUIT`,
      files: [attachment],
      embeds: [embed],
    });
  } else {
    interaction.editReply('Tu as déjà fait ton tirage quotidien');
  }
};
