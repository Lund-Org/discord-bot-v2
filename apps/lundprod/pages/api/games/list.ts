import { getGames, validateFilters } from '@discord-bot-v2/igdb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import { getNumberParam, getParam } from '~/lundprod/utils/next';

import { authOptions } from '../auth/[...nextauth]';

export default async function listGames(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  // if (!session) {
  //   return res.status(401).json({ games: [] });
  // }

  const search = getParam(req.body.search, '');
  const withImage = getParam(req.body.withImage, 'false') === 'true';
  const page = getNumberParam(req.query.page, 1);
  const filters = req.body.filters || [];

  if (!validateFilters(filters)) {
    return res.status(400).json({ games: [] });
  }

  if (typeof search === 'string' && search.length <= 2) {
    return res.json({ games: [] });
  }

  const games = await getGames(search, filters, page < 1 ? 1 : page, withImage);

  res.json({ games });
}
