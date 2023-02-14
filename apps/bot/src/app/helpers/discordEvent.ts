import { prisma } from '@discord-bot-v2/prisma';
import { Pagination } from '@prisma/client';
import axios from 'axios';
import { MessageReaction, User as DiscordUser } from 'discord.js';
import { CARD_PER_PAGE, updateMessage } from '../commands/gacha/cards';

export function invalidateWebsitePages(discordId: string) {
  axios
    .get(
      `http://localhost:${process.env.PORT}/api/refresh-gacha-profile?discordId=${discordId}`
    )
    .catch(() => {
      console.error("Can't reach the refresh gacha profile URL");
    });
}

export const manageGachaPagination = async (
  pagination: Pagination,
  reaction: MessageReaction,
  discordUser: DiscordUser
) => {
  const user = await prisma.user.getPlayerWithInventory(discordUser.id);

  if (!user?.player) {
    return;
  }

  const maxPage = Math.floor(
    user.player.playerInventory.length / CARD_PER_PAGE
  );

  if (pagination.page === maxPage && reaction.emoji.name === '▶') {
    pagination.page = 0;
  } else if (pagination.page === 0 && reaction.emoji.name === '◀') {
    pagination.page = maxPage;
  } else if (reaction.emoji.name === '▶') {
    pagination.page += 1;
  } else if (reaction.emoji.name === '◀') {
    pagination.page -= 1;
  }

  await updateMessage(pagination, reaction, discordUser);
};
