import { getGame } from '@discord-bot-v2/igdb';
import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function updateIGDB(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Received update for ', req.body.id);
  const game = await getGame(req.body.id);

  const platformRegionCombo =
    game.release_dates?.map(({ platform, region }) => [platform.id, region]) ||
    [];

  console.log('combo : ', platformRegionCombo);

  const expectedGamesMatching = await prisma.expectedGame.findMany({
    where: {
      igdbId: game.id,
    },
    include: { releaseDate: true },
  });

  const expectationToRemove = expectedGamesMatching.filter(
    ({ releaseDate }) => {
      const existingPlatformRegion = platformRegionCombo.find(
        ([platformId, region]) =>
          releaseDate.platformId === platformId && releaseDate.region === region
      );

      return !existingPlatformRegion;
    }
  );

  // The combo of the release date and the region cannot be found
  // So we consider it cancelled
  await prisma.expectedGame.updateMany({
    where: {
      id: { in: expectationToRemove.map(({ id }) => id) },
    },
    data: { cancelled: true },
  });

  await Promise.all(
    game.release_dates.map((releaseDate) =>
      prisma.expectedGameReleaseDate.updateMany({
        where: {
          platformId: releaseDate.platform.id,
          region: releaseDate.region,
        },
        data: {
          date: new Date(releaseDate.date * 1000),
        },
      })
    )
  );

  res.json({ success: true });
}
