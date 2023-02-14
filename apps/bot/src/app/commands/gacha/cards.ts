import {
  ChatInputCommandInteraction,
  Message,
  EmbedBuilder,
  MessageReaction,
  User,
} from 'discord.js';
import { userNotFoundWarning } from './helper';
import { CardType, Pagination, PlayerInventory } from '@prisma/client';
import { prisma } from '@discord-bot-v2/prisma';

export const CARD_PER_PAGE = 10;

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
    },
  });
}

function buildSnippet(
  username: string,
  cardInventories: (PlayerInventory & { cardType: CardType })[]
) {
  const snippet = new EmbedBuilder({
    title: `Liste des cartes de ${username} :`,
  });

  cardInventories.forEach((cardInventory) => {
    snippet.addFields({
      name: `#${cardInventory.cardType.id} ${cardInventory.cardType.name}`,
      value: `Type: ${cardInventory.type} | Quantité: x${cardInventory.total}`,
    });
  });
  return snippet;
}

export const cards = async (interaction: ChatInputCommandInteraction) => {
  const user = await prisma.user.findFirst({
    where: { discordId: interaction.user.id, isActive: true },
    include: {
      player: {
        include: {
          playerInventory: {
            include: {
              cardType: true,
            },
            orderBy: {
              cardTypeId: 'asc',
            },
            skip: 0,
            // +1 to see if we have a second page
            take: CARD_PER_PAGE + 1,
          },
        },
      },
    },
  });

  if (!user?.player && user.isActive) {
    return userNotFoundWarning(interaction);
  }

  await interaction.deferReply();
  const tenFirstCards = user.player.playerInventory.slice(0, 10);

  if (!tenFirstCards.length) {
    return interaction.editReply(
      "Aucune carte n'est présente dans l'inventaire"
    );
  }

  const snippet = buildSnippet(interaction.user.username, tenFirstCards);
  await interaction.editReply({ embeds: [snippet] });
  const inventoryMessage = (await interaction.fetchReply()) as Message;

  if (user.player.playerInventory.length > CARD_PER_PAGE) {
    await inventoryMessage.react('◀');
    await inventoryMessage.react('▶');

    await paginateMessage({ userId: interaction.user.id, inventoryMessage });
  }
};

export const updateMessage = async (
  pagination: Pagination,
  reaction: MessageReaction,
  discordUser: User
) => {
  const user = await prisma.user.findFirst({
    where: { discordId: discordUser.id, isActive: true },
    include: {
      player: {
        include: {
          playerInventory: {
            include: {
              cardType: true,
            },
            orderBy: {
              cardTypeId: 'asc',
            },
            skip: pagination.page * CARD_PER_PAGE,
            take: CARD_PER_PAGE,
          },
        },
      },
    },
  });

  if (!user?.player && user.isActive) {
    return;
  }

  const snippet = buildSnippet(
    discordUser.username,
    user.player.playerInventory
  );

  await reaction.message.edit({ embeds: [snippet] });
  await prisma.pagination.update({
    where: { id: pagination.id },
    data: {
      page: pagination.page,
    },
  });
};
