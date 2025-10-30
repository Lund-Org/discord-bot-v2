import axios from 'axios';

import { Filter, Game, OrFilter } from '../types';
import { addGameToCache } from './cache';
import {
  BASE_URL,
  GAME_FIELDS,
  GAME_FIELDS_WITH_IMAGES,
  GAME_PER_PAGE,
  QUERY_OPERATOR,
} from './constants';
import { IGDBQueryBuilder } from './igdb-query-builder';

let twitchToken: {
  access_token: string;
  expires_in: number;
  token_type: 'bearer';
  refreshDate: Date;
} | null = null;

async function twitchAuth() {
  if (twitchToken && twitchToken.refreshDate.getTime() < Date.now()) {
    return twitchToken;
  }

  return axios
    .post(
      'https://id.twitch.tv/oauth2/token',
      {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_SECRET_ID,
        grant_type: 'client_credentials',
      },
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    )
    .then(({ data }) => {
      twitchToken = {
        ...data,
        refreshDate: new Date(Date.now() + data.expires_in * 1000),
      };

      return twitchToken;
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });
}

async function IGDBRequest<T>(
  path: string,
  query: string | URLSearchParams,
  headers: Record<string, string> = {},
  method = 'POST',
): Promise<T> {
  await twitchAuth();

  return axios({
    url: `${BASE_URL}${path}`,
    method,
    headers: {
      Accept: 'application/json',
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${twitchToken.access_token}`,
      ...headers,
    },
    data: query,
  })
    .then(({ data }) => data)
    .catch((err) => {
      if (axios.isAxiosError(err)) {
        // Too many request, limit reach, retry
        if (err.response?.status === 429) {
          return IGDBRequest(path, query);
        }
      }

      throw err;
    });
}

// for test or update data purpose
export async function getPlatforms() {
  const queryBuilder = new IGDBQueryBuilder();
  const query = queryBuilder
    .setFields(['id', 'abbreviation', 'name', 'generation'])
    .setLimit(400)
    .toString();

  return IGDBRequest('/platforms', query);
}

export async function getGames(
  name: string,
  filters: Array<Filter | OrFilter>,
  page = 1,
  withImage = false,
): Promise<Game[]> {
  if (page < 1) {
    page = 1;
  }

  const queryBuilder = new IGDBQueryBuilder();
  queryBuilder
    .setFields(withImage ? GAME_FIELDS_WITH_IMAGES : GAME_FIELDS)
    .setSearch(name)
    .setLimit(GAME_PER_PAGE)
    .setOffset((page - 1) * GAME_PER_PAGE);

  filters.forEach((filter, index) => {
    if ('or' in filter) {
      queryBuilder.orWhere(filter.or);
    } else {
      const { field, operator, value } = filter;

      if (index === 0) {
        queryBuilder.where(field, operator, value);
      } else {
        queryBuilder.andWhere(field, operator, value);
      }
    }
  });

  console.log(queryBuilder.toString());
  const result = await IGDBRequest<Game[]>('/games', queryBuilder.toString());

  if (withImage) {
    for (const game of result) {
      if (game.cover) {
        game.cover.url = `https:${game.cover.url}`;
      }
    }
  }

  await addGameToCache(result);

  return result;
}

export async function getGame(id: number): Promise<Game> {
  const queryBuilder = new IGDBQueryBuilder();
  queryBuilder.setFields(GAME_FIELDS).where('id', QUERY_OPERATOR.EQ, id);

  const result = await IGDBRequest<Game[]>('/games', queryBuilder.toString());

  if (!result.length) {
    throw new Error('Game not found');
  }

  await addGameToCache(result);

  return result[0];
}
