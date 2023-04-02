import { prisma } from '@discord-bot-v2/prisma';

import { Game } from '../types';

export async function addGameToCache(games: Game[]) {
  await Promise.all(
    games.map((game) => {
      const { id, ...rest } = game;

      return prisma.gameCache.upsert({
        create: {
          igdbId: id,
          content: rest,
        },
        update: {
          content: rest,
        },
        where: {
          igdbId: id,
        },
      });
    })
  );
}
