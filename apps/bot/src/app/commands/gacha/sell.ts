import { ChatInputCommandInteraction } from 'discord.js';
import { userNotFound } from './helper';
import { GachaConfigEnum } from '../../enums/GachaEnum';
import { Player, PlayerInventory } from '@prisma/client';
import { prisma } from '@discord-bot-v2/prisma';
import { addPoints } from '@discord-bot-v2/common';

type SellConfig = { basic: number; gold: number };
type CardRarity = 'basic' | 'gold';
type StructuredData = {
  cardToSell: PlayerInventory;
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
      'Erreur, la quantité doit être un nombre supérieur à 0'
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
      `Erreur, tu n'as pas assez de cartes (${cardInPlayerInventory.total} possédées)`
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
  const player = await userNotFound({
    interaction,
  });

  if (!player) {
    return;
  }

  await interaction.deferReply();
  const data = await securityChecks({ interaction, player });

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
    addPoints(player.id, data.earningPoints),
  ]);

  return interaction.editReply(`Tu as gagné ${data.earningPoints} points`);
};
