import { ChatInputCommandInteraction } from 'discord.js';
import {
  generateSummaryEmbed,
  getCardEarnSummary,
  getCardLostSummary,
  userNotFoundWarning,
} from './helper';
import { CardType, Player, PlayerInventory } from '@prisma/client';
import { prisma } from '@discord-bot-v2/prisma';
import { invalidateWebsitePages } from '../../helpers/discordEvent';

async function createOrUpdateGold(player: Player, cardToGold: CardType) {
  await prisma.playerInventory.upsert({
    where: {
      playerId_cardTypeId_type: {
        type: 'gold',
        cardTypeId: cardToGold.id,
        playerId: player.id,
      },
    },
    update: {
      total: { increment: 1 },
    },
    create: {
      total: 1,
      type: 'gold',
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

async function decreaseBasic(inventoryCardBasic: PlayerInventory) {
  await prisma.playerInventory.update({
    where: { id: inventoryCardBasic.id },
    data: {
      total: { decrement: 5 },
    },
  });
}

export const gold = async (interaction: ChatInputCommandInteraction) => {
  const user = await prisma.user.getPlayerWithInventory(interaction.user.id);

  if (!user?.player) {
    return userNotFoundWarning(interaction);
  }

  await interaction.deferReply();
  const cardToGold = interaction.options.getNumber('id', true);

  const card = await prisma.cardType.findUnique({ where: { id: cardToGold } });

  if (!card) {
    return interaction.editReply("La carte n'existe pas");
  }

  const inventoryCardBasic = user.player.playerInventory.find((inventory) => {
    return inventory.cardType.id === cardToGold && inventory.type === 'basic';
  });

  if (inventoryCardBasic && inventoryCardBasic.total >= 5) {
    await Promise.all([
      createOrUpdateGold(user.player, inventoryCardBasic.cardType),
      decreaseBasic(inventoryCardBasic),
    ]);

    const embed = generateSummaryEmbed([
      ...getCardLostSummary(
        user,
        Array.from({ length: 5 }, () => ({
          cardType: inventoryCardBasic.cardType,
          isGold: false,
        }))
      ),
      ...getCardEarnSummary(user, [
        { cardType: inventoryCardBasic.cardType, isGold: true },
      ]),
    ]);

    invalidateWebsitePages(user.discordId);
    return interaction.editReply({
      content: `5 cartes basiques ont été transformées en une carte en or (#${cardToGold})`,
      embeds: [embed],
    });
  } else if (inventoryCardBasic) {
    return interaction.editReply(
      'Tu ne possèdes pas assez de cartes basiques (5 cartes basiques = 1 carte en or)'
    );
  } else {
    return interaction.editReply('Tu ne possèdes pas la carte');
  }
};
