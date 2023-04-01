import axios from 'axios';
import { Game } from '../types';
import { BASE_URL, GAME_PER_PAGE, QUERY_OPERATOR } from './constants';
import { ConditionValue, IGDBQueryBuilder } from './igdb-query-builder';

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

async function IGDBRequest(path: string, query: string) {
  await twitchAuth();

  return axios({
    url: `${BASE_URL}${path}`,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${twitchToken.access_token}`,
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
  filters: { field: string; operator: QUERY_OPERATOR; value: ConditionValue }[],
  page = 1
): Promise<Game[]> {
  if (page < 1) {
    page = 1;
  }

  const queryBuilder = new IGDBQueryBuilder();
  queryBuilder
    .setFields([
      'id',
      'name',
      'status',
      'storyline',
      'summary',
      'version_title',
      'category',
      'url',
      'platforms.id',
      'platforms.name',
      'release_dates.date',
      'release_dates.platform',
      'release_dates.region',
      'release_dates.human',
      'release_dates.platform.name',
    ])
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

  return IGDBRequest('/games', queryBuilder.toString());
}
