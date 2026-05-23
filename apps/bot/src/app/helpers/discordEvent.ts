import { Pagination } from '@prisma/client';
import axios from 'axios';
import { MessageReaction, User } from 'discord.js';

import {
  EQUIPMENT_PER_PAGE,
  updateMessage,
} from '../commands/adventure/inventory';

export function invalidateWebsitePages(discordId: string) {
  axios
    .get(
      `http://localhost:${process.env.PORT}/api/refresh-gacha-profile?discordId=${discordId}`,
    )
    .catch(() => {
      console.error("Can't reach the refresh gacha profile URL");
    });
}

export const manageAdventurePagination = async (
  pagination: Pagination,
  reaction: MessageReaction,
  discordUser: User,
) => {
  const user = await prisma.user.findUnique({
    where: { discordId: discordUser.id },
    include: {
      adventurePlayer: {
        include: {
          inventoryEquipments: true,
        },
      },
    },
  });

  if (!user?.adventurePlayer) {
    return;
  }

  const maxPage = Math.floor(
    user.adventurePlayer.inventoryEquipments.length / EQUIPMENT_PER_PAGE,
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
