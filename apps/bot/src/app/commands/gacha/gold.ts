import { ChatInputCommandInteraction } from 'discord.js';
import { userNotFound } from './helper';
import { CardType, Player, PlayerInventory } from '@prisma/client';
import { prisma } from '@discord-bot-v2/prisma';

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
  const player = (await userNotFound({
    interaction,
    relations: {
      gifts: true,
      playerInventory: {
        include: {
          cardType: true,
        },
      },
    },
  })) as Player & {
    playerInventory: (PlayerInventory & { cardType: CardType })[];
  };

  if (!player) {
    return;
  }

  await interaction.deferReply();
  const cardToGold = interaction.options.getNumber('id', true);

  const card = await prisma.cardType.findUnique({ where: { id: cardToGold } });

  if (!card) {
    return interaction.editReply("La carte n'existe pas");
  }

  const inventoryCardBasic = player.playerInventory.find((inventory) => {
    return inventory.cardType.id === cardToGold && inventory.type === 'basic';
  });

  if (inventoryCardBasic && inventoryCardBasic.total >= 5) {
    await Promise.all([
      createOrUpdateGold(player, inventoryCardBasic.cardType),
      decreaseBasic(inventoryCardBasic),
    ]);
    return interaction.editReply(
      '5 cartes basiques ont été transformée en une carte en or'
    );
  } else if (inventoryCardBasic) {
    return interaction.editReply(
      'Tu ne possèdes pas assez de cartes basic (5 cartes basiques = 1 carte en or)'
    );
  } else {
    return interaction.editReply('Tu ne possèdes pas la carte');
  }
};
