import { ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js';
import {
  addCardsToInventory,
  drawCards,
  generateSummaryEmbed,
  getCardEarnSummary,
  invalidateWebsitePages,
  userNotFound,
} from './helper';
import { GachaConfigEnum } from '../../enums/GachaEnum';
import { prisma } from '@discord-bot-v2/prisma';
import { Player, PlayerInventory } from '@prisma/client';
import { generateDrawImage } from '../../helpers/canvas';

type PriceConfig = { price: number };

async function securityChecks({
  interaction,
  player,
}: {
  interaction: ChatInputCommandInteraction;
  player: Player;
}): Promise<{ cardNumberToBuy: number; totalPrice: number } | null> {
  const configPriceJSON = await prisma.config.findUnique({
    where: { name: GachaConfigEnum.PRICE },
  });
  const priceConfig: PriceConfig = configPriceJSON?.value as PriceConfig;
  const cardNumberToBuy = interaction.options.getNumber('quantity', true);

  if (cardNumberToBuy < 1 || cardNumberToBuy > 6) {
    await interaction.editReply(
      'Erreur, le nombre de cartes achetable doit être entre 1 et 6'
    );
    return null;
  }

  if (player.points < cardNumberToBuy * priceConfig.price) {
    await interaction.editReply(
      `Tu n'as pas assez de points (points actuels : ${
        player.points
      }, points nécessaires : ${cardNumberToBuy * priceConfig.price})`
    );
    return null;
  }

  return {
    cardNumberToBuy,
    totalPrice: cardNumberToBuy * priceConfig.price,
  };
}

export const buy = async (interaction: ChatInputCommandInteraction) => {
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

  if (!player) {
    return;
  }

  await interaction.deferReply();
  const cardToDraw = await securityChecks({ interaction, player });

  if (cardToDraw === null) {
    return;
  }

  const cards = await drawCards(cardToDraw.cardNumberToBuy);
  const canvas = await generateDrawImage(interaction.user.username, cards);
  const attachment = new AttachmentBuilder(canvas.toBuffer(), {
    name: 'cards.png',
  });
  const embed = generateSummaryEmbed(getCardEarnSummary(player, cards));

  await addCardsToInventory(player, cards, cardToDraw.totalPrice);
  invalidateWebsitePages(player.discordId);
  return interaction.editReply({
    content: getSuccessMessage(
      cardToDraw.cardNumberToBuy,
      player.points - cardToDraw.totalPrice
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
