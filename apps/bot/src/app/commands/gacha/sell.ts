import { addPoints, GachaConfigEnum, SellConfig } from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import { CardType, Player, PlayerInventory } from '@prisma/client';
import { ChatInputCommandInteraction } from 'discord.js';

import { invalidateWebsitePages } from '../../helpers/discordEvent';
import {
  checkEndGame,
  generateSummaryEmbed,
  getCardLostSummary,
  userNotFoundWarning,
} from './helper';

type CardRarity = 'basic' | 'gold';
type StructuredData = {
  cardToSell: PlayerInventory & { cardType: CardType };
  quantity: number;
  earningPoints: number;
};

async function securityChecks({
  interaction,
  player,
}: {
  interaction: ChatInputCommandInteraction;
  player: Player;
}): Promise<StructuredData | null> {
  const configPriceJSON = await prisma.config.findUnique({
    where: { name: GachaConfigEnum.SELL },
  });
  const cardType = interaction.options.getString('type', true);
  const cardId = interaction.options.getNumber('id', true);
  const quantity = interaction.options.getNumber('quantity', true);

  if (quantity <= 0) {
    await interaction.editReply(
      'Erreur, la quantité doit être un nombre supérieur à 0',
    );
    return null;
  }

  const card = await prisma.cardType.findUnique({
    where: {
      id: cardId,
    },
  });

  if (!card) {
    await interaction.editReply("Erreur, la carte n'existe pas");
    return null;
  }
  const cardInPlayerInventory = await prisma.playerInventory.findUnique({
    where: {
      playerId_cardTypeId_type: {
        playerId: player.id,
        cardTypeId: card.id,
        type: cardType,
      },
    },
    include: {
      cardType: true,
    },
  });
  const priceConfig: SellConfig = configPriceJSON?.value as SellConfig;

  if (!cardInPlayerInventory) {
    await interaction.editReply('Erreur, tu ne possèdes pas la carte');
    return null;
  }
  if (cardInPlayerInventory.total < quantity) {
    await interaction.editReply(
      `Erreur, tu n'as pas assez de cartes (${cardInPlayerInventory.total} possédées)`,
    );
    return null;
  }

  return {
    cardToSell: cardInPlayerInventory,
    quantity,
    earningPoints:
      quantity *
      priceConfig[cardInPlayerInventory.type as CardRarity] *
      cardInPlayerInventory.cardType.level,
  };
}

export const sell = async (interaction: ChatInputCommandInteraction) => {
  const user = await prisma.user.getPlayerWithInventory(interaction.user.id);

  if (!user?.player) {
    return userNotFoundWarning(interaction);
  }

  await interaction.deferReply();
  const cardType = interaction.options.getString('type', true);
  const data = await securityChecks({ interaction, player: user.player });

  if (data === null) {
    return;
  }

  // To handle concurrency
  // @Todo : transaction ?
  await Promise.all([
    prisma.playerInventory.update({
      where: { id: data.cardToSell.id },
      data: {
        total: {
          decrement: data.quantity,
        },
      },
    }),
    addPoints(user.player.id, data.earningPoints),
  ]);

  const embed = generateSummaryEmbed(
    getCardLostSummary(
      user,
      Array.from({ length: data.quantity }, () => ({
        cardType: data.cardToSell.cardType,
        isGold: cardType === 'gold',
      })),
    ),
  );
  invalidateWebsitePages(user.discordId);
  await checkEndGame(user.id);
  return interaction.editReply({
    content: `Tu as gagné ${data.earningPoints} points - Tu as ${
      user.player.points + data.earningPoints
    } points`,
    embeds: [embed],
  });
};
