import { rarityMapping } from '@discord-bot-v2/common';
import {
  AdventureEquipment,
  AdventurePlayerInventoryEquipment,
  Pagination,
  PaginationType,
} from '@prisma/client';
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Message,
  MessageReaction,
  User,
} from 'discord.js';

import { getEquipmentData } from './utils';

export const EQUIPMENT_PER_PAGE = 10;

async function paginateMessage({
  userId,
  inventoryMessage,
}: {
  userId: string;
  inventoryMessage: Message;
}) {
  return prisma.pagination.create({
    data: {
      page: 0,
      discordUserId: userId,
      discordMessageId: inventoryMessage.id,
      type: PaginationType.ADVENTURE_INVENTORY,
    },
  });
}

function buildSnippet(
  name: string,
  equipments: Array<
    AdventurePlayerInventoryEquipment & { equipment: AdventureEquipment }
  >,
) {
  const embed = new EmbedBuilder()
    .setColor('#0ee8da')
    .setTitle(`Inventaire de ${name}`);

  if (!equipments.length) {
    embed.addFields([
      {
        name: 'Aucun objet',
        value: '',
      },
    ]);
  }

  equipments.forEach((inventoryEquipment) => {
    const { life, magicDmg, physicalDmg, shield, slot } = getEquipmentData(
      inventoryEquipment.equipment,
    );

    const value = [physicalDmg, magicDmg, life, shield, slot]
      .filter(Boolean)
      .join(' · ');

    embed.addFields([
      {
        name: `#${inventoryEquipment.id} ${inventoryEquipment.equipment.name} x${inventoryEquipment.count} [${rarityMapping[inventoryEquipment.equipment.rarity]}]`,
        value,
      },
    ]);
  });

  return embed;
}

export const inventory = async (interaction: ChatInputCommandInteraction) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { discordId: interaction.user.id, isActive: true },
    include: {
      adventurePlayer: {
        include: {
          inventoryEquipments: {
            include: {
              equipment: true,
            },
            orderBy: {
              equipmentId: 'asc',
            },
            skip: 0,
            // +1 to see if we have a second page
            take: EQUIPMENT_PER_PAGE + 1,
          },
        },
      },
    },
  });

  if (!user?.adventurePlayer) {
    return interaction.reply(
      `Il faut d'abord rejoindre l'aventure avec la commande /adventure join`,
    );
  }

  await interaction.deferReply();
  const snippet = buildSnippet(
    user.adventurePlayer.name,
    user.adventurePlayer.inventoryEquipments,
  );
  await interaction.editReply({ embeds: [snippet] });

  const inventoryMessage = (await interaction.fetchReply()) as Message;

  if (user.adventurePlayer.inventoryEquipments.length > EQUIPMENT_PER_PAGE) {
    await inventoryMessage.react('◀');
    await inventoryMessage.react('▶');

    await paginateMessage({ userId: interaction.user.id, inventoryMessage });
  }
};

export const updateMessage = async (
  pagination: Pagination,
  reaction: MessageReaction,
  discordUser: User,
) => {
  const user = await prisma.user.findFirst({
    where: { discordId: discordUser.id, isActive: true },
    include: {
      adventurePlayer: {
        include: {
          inventoryEquipments: {
            include: {
              equipment: true,
            },
            orderBy: {
              equipmentId: 'asc',
            },
            skip: pagination.page * EQUIPMENT_PER_PAGE,
            take: EQUIPMENT_PER_PAGE,
          },
        },
      },
    },
  });

  if (!user?.adventurePlayer && user.isActive) {
    return;
  }

  const snippet = buildSnippet(
    user.adventurePlayer.name,
    user.adventurePlayer.inventoryEquipments,
  );

  await reaction.message.edit({ embeds: [snippet] });
  await prisma.pagination.update({
    where: { id: pagination.id },
    data: {
      page: pagination.page,
    },
  });
};
