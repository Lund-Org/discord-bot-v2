import { Game, getGame } from '@discord-bot-v2/igdb';
import { prisma } from '@discord-bot-v2/prisma';
import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { boolean, number, object } from 'yup';

import { getUserProfileUrl } from '~/lundprod/utils/url';

import { authOptions } from '../auth/[...nextauth]';

const addExpectedGameSchema = object({
  igdbGameId: number().required().positive().integer(),
  platformId: number().positive().integer(),
  addToBacklog: boolean().required(),
});

export default async function addExpectedGame(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ success: false });
  }

  const user = await prisma.user.findFirst({
    where: {
      discordId: session.userId,
      isActive: true,
    },
  });

  if (!user) {
    return res.status(404).json({ success: false });
  }

  const payload = await addExpectedGameSchema.validate(req.body);
  const gameCache = await prisma.gameCache.findUnique({
    where: {
      igdbId: payload.igdbGameId,
    },
  });

  let gameContent: Game;

  if (!gameCache) {
    gameContent = await getGame(payload.igdbGameId);

    res.status(404);
    return res.json({ success: false });
  } else {
    gameContent = {
      id: payload.igdbGameId,
      ...(gameCache.content as Omit<Game, 'id'>),
    };
  }

  const releaseDates: Prisma.ExpectedGameReleaseDateCreateManyExpectedGameInput[] =
    gameContent.release_dates
      .filter((releaseDate) => {
        if (!payload.platformId) {
          return true;
        }

        return releaseDate.platform.id === payload.platformId;
      })
      .map((releaseDate) => ({
        date: new Date(releaseDate.date),
        platformId: releaseDate.platform.id,
      }));

  await prisma.expectedGame.create({
    data: {
      addToBacklog: payload.addToBacklog,
      igdbId: payload.igdbGameId,
      name: gameContent.name,
      url: gameContent.url,
      cancelled: false,
      platformId: payload.platformId,
      userId: user.id,
      releaseDates: {
        createMany: { data: releaseDates },
      },
    },
  });

  res.revalidate(getUserProfileUrl(session.userId));

  res.json({ success: true });
}
