import axios from 'axios';
import {
  BASE_URL,
  GAME_PER_PAGE,
  GAME_STATUS,
  GAME_TYPE,
  QUERY_OPERATOR,
  REGION,
} from './constants';
import { ConditionValue, IGDBQueryBuilder } from './igdb-query-builder';
import { platForms } from './platforms';
import {
  linkArrayData,
  linkEnumData,
  linkValueToArrayData,
  translateGameType,
  translateRegion,
} from './utils';

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
) {
  if (page < 1) {
    page = 1;
  }

  const search = name.split(' ');

  const queryBuilder = new IGDBQueryBuilder();
  queryBuilder
    .setFields([
      'id',
      'release_dates',
      'name',
      'status',
      'storyline',
      'summary',
      'version_title',
      'platforms',
      'category',
      'url',
    ])
    .setLimit(GAME_PER_PAGE)
    .setOffset((page - 1) * GAME_PER_PAGE)
    .sortBy('rating', 'desc');

  search.forEach((searchChunk, index) => {
    if (index === 0) {
      queryBuilder.where(
        'name',
        QUERY_OPERATOR.MATCH,
        searchChunk.replaceAll('"', '')
      );
    } else {
      queryBuilder.andWhere(
        'name',
        QUERY_OPERATOR.MATCH,
        searchChunk.replaceAll('"', '')
      );
    }
  });

  filters.forEach(({ field, operator, value }) =>
    queryBuilder.andWhere(field, operator, value)
  );

  return IGDBRequest('/games', queryBuilder.toString()).then((data) => {
    data.forEach((game) => {
      linkArrayData(game, platForms, 'platforms', 'platforms');
      linkEnumData(game, GAME_TYPE, 'category', 'category', translateGameType);
      linkEnumData(game, GAME_STATUS, 'status', 'status');

      // To remove "null" values because some platforms are ignored
      game.platforms = game.platforms.filter(Boolean);
    });
    return data;
  });
}

export async function getReleaseDates(ids: string[], page = 1) {
  if (page < 1) {
    page = 1;
  }

  const queryBuilder = new IGDBQueryBuilder();
  const query = queryBuilder
    .setFields(['date', 'human', 'platform', 'region'])
    .where('id', QUERY_OPERATOR.EQ, ids)
    .setLimit(100)
    .setOffset((page - 1) * 100)
    .toString();

  return IGDBRequest('/release_dates', query).then((data) => {
    data.forEach((releaseDate) => {
      linkEnumData(releaseDate, REGION, 'region', 'region', translateRegion);
      linkValueToArrayData(releaseDate, platForms, 'platform', 'platform');
    });
    return data;
  });
}
