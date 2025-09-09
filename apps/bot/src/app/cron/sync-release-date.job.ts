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
        ({ platform, release_region }) =>
          expectedGame.releaseDate.platformId === platform.id &&
          expectedGame.releaseDate.region === release_region,
      );

      if (!relatedReleaseDate) {
        await prisma.expectedGame.update({
          where: { id: expectedGame.id },
          data: { cancelled: true },
        });

        continue;
      } else if (expectedGame.cancelled) {
        await prisma.expectedGame.update({
          where: { id: expectedGame.id },
          data: { cancelled: false },
        });
      }

      if (!relatedReleaseDate.date) {
        await prisma.expectedGameReleaseDate.update({
          where: { id: expectedGame.releaseDate.id },
          data: { date: null },
        });

        continue;
      }

      if (
        (!expectedGame.releaseDate.date && relatedReleaseDate.date) ||
        relatedReleaseDate.date * 1000 !==
          expectedGame.releaseDate.date.getTime()
      ) {
        if (relatedReleaseDate.date * 1000 < new Date().getTime()) {
          await prisma.expectedGame.delete({
            where: { id: expectedGame.id },
          });
        } else {
          await prisma.expectedGameReleaseDate.update({
            where: { id: expectedGame.releaseDate.id },
            data: { date: new Date(relatedReleaseDate.date * 1000) },
          });
        }
      }
    } catch (e) {
      console.error(e);
      console.error(
        `Error while synchronizing - id:${expectedGame.id} | igdbId:${expectedGame.igdbId}`,
      );
    }
  }
}
