import { prisma } from '@discord-bot-v2/prisma';
import { Pagination } from '@prisma/client';
import { MessageReaction, User } from 'discord.js';
import { CARD_PER_PAGE, updateMessage } from '../commands/gacha/cards';

export const manageGachaPagination = async (
  pagination: Pagination,
  reaction: MessageReaction,
  user: User
) => {
  const player = await prisma.player.findUnique({
    where: { discordId: user.id },
    include: {
      playerInventory: true,
    },
  });

  if (!player) {
    return;
  }

  const maxPage = Math.floor(player.playerInventory.length / CARD_PER_PAGE);

  if (pagination.page === maxPage && reaction.emoji.name === '▶') {
    pagination.page = 0;
  } else if (pagination.page === 0 && reaction.emoji.name === '◀') {
    pagination.page = maxPage;
  } else if (reaction.emoji.name === '▶') {
    pagination.page += 1;
  } else if (reaction.emoji.name === '◀') {
    pagination.page -= 1;
  }

  await updateMessage(pagination, reaction, user);
};
