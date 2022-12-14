import { prisma } from '@discord-bot-v2/prisma';
import { Player, PlayerInventory } from '@prisma/client';
import { ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js';
import { generateDrawImage } from '../../helpers/canvas';
import { invalidateWebsitePages } from '../../helpers/discordEvent';
import {
  addCardsToInventory,
  drawCards,
  generateSummaryEmbed,
  getCardEarnSummary,
  userNotFound,
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
  const player = (await userNotFound({
    interaction,
    relations: {
      playerInventory: {
        include: {
          cardType: true,
        },
      },
    },
  })) as Player & { playerInventory: PlayerInventory[] };
  const dailyDrawDate = new Date();

  if (!player) {
    return;
  }

  await interaction.deferReply();
  const drawPossible = canDrawCard(player);

  if (drawPossible) {
    const cards = await drawCards(1);
    const canvas = await generateDrawImage(interaction.user.username, cards);
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: 'cards.png',
    });
    const embed = generateSummaryEmbed(getCardEarnSummary(player, cards));

    await addCardsToInventory(player, cards, 0);
    await setDailyDraw(dailyDrawDate, player.id);
    invalidateWebsitePages(player.discordId);
    interaction.editReply({
      content: `Voici ton tirage quotidien GRA-TUIT`,
      files: [attachment],
      embeds: [embed],
    });
  } else {
    interaction.editReply('Tu as déjà fait ton tirage quotidien');
  }
};
