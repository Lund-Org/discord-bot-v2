import { prisma } from '@discord-bot-v2/prisma';
import { CardType, Player, PlayerInventory } from '@prisma/client';
import { ChatInputCommandInteraction } from 'discord.js';

import { invalidateWebsitePages } from '../../helpers/discordEvent';
import {
  generateSummaryEmbed,
  getCardEarnSummary,
  getCardLostSummary,
  userNotFoundWarning,
} from './helper';

async function createOrUpdateBasic(player: Player, cardToGold: CardType) {
  await prisma.playerInventory.upsert({
    where: {
      playerId_cardTypeId_type: {
        type: 'basic',
        cardTypeId: cardToGold.id,
        playerId: player.id,
      },
    },
    update: {
      total: { increment: 4 },
    },
    create: {
      total: 4,
      type: 'basic',
      player: {
        connect: {
          id: player.id,
        },
      },
      cardType: {
        connect: {
          id: cardToGold.id,
        },
      },
    },
  });
}

async function decreaseGold(inventoryCardBasic: PlayerInventory) {
  await prisma.playerInventory.update({
    where: { id: inventoryCardBasic.id },
    data: {
      total: { decrement: 1 },
    },
  });
}

export const dismantle = async (interaction: ChatInputCommandInteraction) => {
  const user = await prisma.user.getPlayerWithInventory(interaction.user.id);

  if (!user?.player) {
    return userNotFoundWarning(interaction);
  }

  await interaction.deferReply();
  const cardToDismantle = interaction.options.getNumber('id', true);

  const card = await prisma.cardType.findUnique({
    where: { id: cardToDismantle },
  });

  if (!card) {
    return interaction.editReply("La carte n'existe pas");
  }

  const inventoryCardBasic = user.player.playerInventory.find((inventory) => {
    return (
      inventory.cardType.id === cardToDismantle && inventory.type === 'gold'
    );
  });

  if (inventoryCardBasic && inventoryCardBasic.total > 0) {
    await Promise.all([
      createOrUpdateBasic(user.player, inventoryCardBasic.cardType),
      decreaseGold(inventoryCardBasic),
    ]);

    const embed = generateSummaryEmbed([
      ...getCardEarnSummary(
        user,
        Array.from({ length: 4 }, () => ({
          cardType: inventoryCardBasic.cardType,
          isGold: false,
        }))
      ),
      ...getCardLostSummary(user, [
        { cardType: inventoryCardBasic.cardType, isGold: true },
      ]),
    ]);

    invalidateWebsitePages(user.discordId);
    return interaction.editReply({
      content: `Une carte en or a été transformé en 4 cartes basiques (#${cardToDismantle})`,
      embeds: [embed],
    });
  } else if (inventoryCardBasic) {
    return interaction.editReply(
      'Tu ne possèdes pas la carte dorée (1 carte dorée = 4 cartes basiques)'
    );
  } else {
    return interaction.editReply('Tu ne possèdes pas la carte');
  }
};
