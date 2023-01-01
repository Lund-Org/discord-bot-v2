import {
  getGames,
  getReleaseDates,
  linkArrayData,
  validateFilters,
} from '@discord-bot-v2/igdb';
import { chunk } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import { getNumberParam, getParam } from '../../../utils/next';

export default async function listGames(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const releaseDateIds = [];
  const releaseDates = [];
  const search = getParam(req.body.search, '');
  const page = getNumberParam(req.query.page, 1);
  const filters = req.body.filters || [];

  if (!validateFilters(filters)) {
    return res.status(400).json({ games: [] });
  }

  if (search.length <= 3 || typeof search !== 'string') {
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

  res.json({
    games: JSON.parse(JSON.stringify(games)),
  });
}
