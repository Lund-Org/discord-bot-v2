import axios from 'axios';

import { Game, IGDBConditionValue, Webhook } from '../types';
import { addGameToCache } from './cache';
import {
  BASE_URL,
  GAME_FIELDS,
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
      }
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
  method = 'POST'
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
  filters: {
    field: string;
    operator: QUERY_OPERATOR;
    value: IGDBConditionValue;
  }[],
  page = 1
): Promise<Game[]> {
  if (page < 1) {
    page = 1;
  }

  const queryBuilder = new IGDBQueryBuilder();
  queryBuilder
    .setFields(GAME_FIELDS)
    .setSearch(name)
    .setLimit(GAME_PER_PAGE)
    .setOffset((page - 1) * GAME_PER_PAGE);

  filters.forEach(({ field, operator, value }, index) => {
    if (index === 0) {
      queryBuilder.where(field, operator, value);
    } else {
      queryBuilder.andWhere(field, operator, value);
    }
  });

  const result = await IGDBRequest<Game[]>('/games', queryBuilder.toString());

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

export async function getWebhooks(): Promise<Webhook[]> {
  return IGDBRequest('/webhooks', undefined, undefined, 'GET');
}

export async function addWebhooks() {
  const params = new URLSearchParams();
  params.append('url', process.env.WEBSITE_URL + '/api/webhooks/igdb/update');
  params.append('method', 'update');
  params.append('secret', process.env.IGDB_WEBHOOK_SECRET);

  return IGDBRequest(
    '/games/webhooks',
    params,
    {
      'content-type': 'application/x-www-form-urlencoded',
    },
    'POST'
  );
}
