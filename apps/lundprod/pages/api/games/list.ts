import {
  getGames,
  getReleaseDates,
  linkArrayData,
  validateFilters,
} from '@discord-bot-v2/igdb';
import { chunk } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { getNumberParam, getParam } from '../../../utils/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function listGames(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ games: [] });
  }

  const releaseDateIds = [];
  const releaseDates = [];
  const search = getParam(req.body.search, '');
  const page = getNumberParam(req.query.page, 1);
  const filters = req.body.filters || [];

  if (!validateFilters(filters)) {
    return res.status(400).json({ games: [] });
  }

  if (typeof search === 'string' && search.length <= 3) {
    return res.json({ games: [] });
  }

  const games = await getGames(search, filters, page < 1 ? 1 : page);

  if (games.length) {
    games.forEach((game) => {
      releaseDateIds.push(...(game.release_dates || []));
    });
    const releaseDateChunkIds = chunk([...new Set(releaseDateIds)], 100);
    const releaseDatesPromises = releaseDateChunkIds.map((releaseDateChunk) =>
      getReleaseDates(releaseDateChunk)
    );

    await Promise.all(releaseDatesPromises).then((chunk) => {
      chunk.forEach((data) => releaseDates.push(...data));
    });

    games.forEach((game) => {
      linkArrayData(game, releaseDates, 'release_dates', 'releaseDates');
    });
  }

  res.json({ games });
}
