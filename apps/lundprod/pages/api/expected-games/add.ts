import { ArrayElement } from '@discord-bot-v2/common';
import { Game, getGame } from '@discord-bot-v2/igdb';
import { prisma } from '@discord-bot-v2/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { boolean, number, object } from 'yup';

import { getUserProfileUrl } from '~/lundprod/utils/url';

import { authOptions } from '../auth/[...nextauth]';

const addExpectedGameSchema = object({
  igdbGameId: number().required().positive().integer(),
  platformId: number().required().positive().integer(),
  region: number().required().positive().integer(),
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

  /** GET GAME DATA */
  const gameCache = await prisma.gameCache.findUnique({
    where: {
      igdbId: payload.igdbGameId,
    },
  });

  let gameContent: Game;

  if (!gameCache) {
    gameContent = await getGame(payload.igdbGameId);

    if (!gameContent) {
      res.status(404);
      return res.json({ success: false });
    }
  } else {
    gameContent = {
      id: payload.igdbGameId,
      ...(gameCache.content as Omit<Game, 'id'>),
    };
  }
  /** --------- */

  const releaseDate: ArrayElement<Game['release_dates']> =
    gameContent.release_dates.find((releaseDate) => {
      if (releaseDate.date * 1000 < Date.now()) {
        return false;
      }

      return releaseDate.platform.id === payload.platformId;
    });

  if (!releaseDate) {
    res.status(400);
    return res.json({ success: false });
  }

  const expectedGame = await prisma.expectedGame.findUnique({
    where: {
      igdbId_userId: {
        igdbId: payload.igdbGameId,
        userId: user.id,
      },
    },
    include: { releaseDate: true },
  });

  if (!expectedGame) {
    // If the game is not awaited in database
    await prisma.expectedGame.create({
      data: {
        addToBacklog: payload.addToBacklog,
        igdbId: payload.igdbGameId,
        name: gameContent.name,
        url: gameContent.url,
        cancelled: false,
        userId: user.id,
        releaseDate: {
          create: {
            date: new Date(releaseDate.date * 1000),
            platformId: releaseDate.platform.id,
            region: releaseDate.region,
          },
        },
      },
    });
  } else {
    res.status(400);
    return res.json({ success: false });
  }

  res.revalidate(getUserProfileUrl(session.userId));

  res.json({ success: true });
}
