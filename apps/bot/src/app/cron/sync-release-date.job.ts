import { Game, getGame } from '@discord-bot-v2/igdb';
import { prisma } from '@discord-bot-v2/prisma';

export const cronTiming = '0 0 3 * * *';

export async function cronDefinition() {
  const cache: Record<string, Game> = {};
  const expectedGames = await prisma.expectedGame.findMany({
    include: {
      releaseDate: true,
    },
  });

  for (const expectedGame of expectedGames) {
    try {
      const game =
        expectedGame.igdbId in cache
          ? cache[expectedGame.igdbId]
          : await getGame(expectedGame.igdbId);

      cache[expectedGame.igdbId] = game;

      const relatedReleaseDate = game.release_dates.find(
        ({ platform, region }) =>
          expectedGame.releaseDate.platformId === platform.id &&
          expectedGame.releaseDate.region === region
      );

      if (!relatedReleaseDate) {
        await prisma.expectedGame.update({
          where: { id: expectedGame.id },
          data: { cancelled: true },
        });

        continue;
      }

      if (!relatedReleaseDate.date) {
        await prisma.expectedGameReleaseDate.update({
          where: { id: expectedGame.releaseDate.id },
          data: { date: null },
        });

        continue;
      }

      if (
        relatedReleaseDate.date * 1000 !==
        expectedGame.releaseDate.date.getTime()
      ) {
        await prisma.expectedGameReleaseDate.update({
          where: { id: expectedGame.releaseDate.id },
          data: { date: new Date(relatedReleaseDate.date * 1000) },
        });
      }
    } catch (e) {
      console.error(
        `Error while synchronizing - id:${expectedGame.id} | igdbId:${expectedGame.igdbId}`
      );
    }
  }
}
