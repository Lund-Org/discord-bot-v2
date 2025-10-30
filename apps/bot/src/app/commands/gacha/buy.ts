import { GachaConfigEnum, PriceConfig } from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import { Player, User } from '@prisma/client';
import { AttachmentBuilder, ChatInputCommandInteraction } from 'discord.js';

import { generateDrawImage } from '../../helpers/canvas';
import { invalidateWebsitePages } from '../../helpers/discordEvent';
import {
  addCardsToInventory,
  checkEndGame,
  drawCards,
  generateSummaryEmbed,
  getCardEarnSummary,
  userNotFoundWarning,
} from './helper';

async function securityChecks({
  interaction,
  user,
}: {
  interaction: ChatInputCommandInteraction;
  user: User & { player: Player };
}): Promise<{ cardNumberToBuy: number; totalPrice: number } | null> {
  const configPriceJSON = await prisma.config.findUnique({
    where: { name: GachaConfigEnum.PRICE },
  });
  const priceConfig: PriceConfig = configPriceJSON?.value as PriceConfig;
  const cardNumberToBuy = interaction.options.getNumber('quantity', true);

  if (cardNumberToBuy < 1 || cardNumberToBuy > 6) {
    await interaction.editReply(
      'Erreur, le nombre de cartes achetable doit être entre 1 et 6',
    );
    return null;
  }

  if (user.player.points < cardNumberToBuy * priceConfig.price) {
    await interaction.editReply(
      `Tu n'as pas assez de points (points actuels : ${
        user.player.points
      }, points nécessaires : ${cardNumberToBuy * priceConfig.price})`,
    );
    return null;
  }

  return {
    cardNumberToBuy,
    totalPrice: cardNumberToBuy * priceConfig.price,
  };
}

export const buy = async (interaction: ChatInputCommandInteraction) => {
  const user = await prisma.user.getPlayerWithInventory(interaction.user.id);

  if (!user?.player) {
    return userNotFoundWarning(interaction);
  }

  await interaction.deferReply();
  const cardToDraw = await securityChecks({ interaction, user });

  if (cardToDraw === null) {
    return;
  }

  const cards = await drawCards(cardToDraw.cardNumberToBuy);
  const canvas = await generateDrawImage(interaction.user.username, cards);
  const attachment = new AttachmentBuilder(canvas.toBuffer(), {
    name: 'cards.png',
  });
  const embed = generateSummaryEmbed(getCardEarnSummary(user, cards));

  await addCardsToInventory(user, cards, cardToDraw.totalPrice);
  invalidateWebsitePages(user.discordId);
  await checkEndGame(user.id);
  return interaction.editReply({
    content: getSuccessMessage(
      cardToDraw.cardNumberToBuy,
      user.player.points - cardToDraw.totalPrice,
    ),
    files: [attachment],
    embeds: [embed],
  });
};

function getSuccessMessage(nb: number, points: number) {
  if (nb === 1) {
    return `Voici la carte que tu as acheté - il te reste ${points} points`;
  }

  return `Voici les ${nb} cartes que tu as acheté - il te reste ${points} points`;
}
