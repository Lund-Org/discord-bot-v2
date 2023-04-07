import { ValueOf } from '@discord-bot-v2/common';

import { gameTypeMapping } from './lib/constants';

export enum GAME_TYPE {
  MAIN_GAME = 0,
  DLC_ADDON = 1,
  EXPANSION = 2,
  BUNDLE = 3,
  STANDALONE_EXPANSION = 4,
  MOD = 5,
  EPISODE = 6,
  SEASON = 7,
  REMAKE = 8,
  REMASTER = 9,
  EXPANDED_GAME = 10,
  PORT = 11,
  FORK = 12,
  PACK = 13,
  UPDATE = 14,
}
export enum GAME_STATUS {
  RELEASED = 0,
  ALPHA = 2,
  BETA = 3,
  EARLY_ACCESS = 4,
  OFFLINE = 5,
  CANCELLED = 6,
  RUMORED = 7,
  DELISTED = 8,
}
export enum REGION {
  EUROPE = 1,
  NORTH_AMERICA = 2,
  AUSTRALIA = 3,
  NEW_ZEALAND = 4,
  JAPAN = 5,
  CHINA = 6,
  ASIA = 7,
  WORLDWIDE = 8,
  KOREA = 9,
  BRAZIL = 10,
}

export type Game = {
  id: number;
  name: string;
  status?: GAME_STATUS;
  storyline?: string;
  summary?: string;
  version_title?: string;
  category: GAME_TYPE;
  url: string;
  platforms?: Array<{
    id: number;
    name: string;
  }>;
  release_dates?: Array<{
    id: number;
    date: number;
    region: REGION;
    human: string;
    platform: {
      id: number;
      name: string;
    };
  }>;
};

export type LightGame = Pick<Game, 'id' | 'name'>;

export type GameTypeTranslation = ValueOf<typeof gameTypeMapping> | 'Autre';

export type IGDBConditionValue = string[] | number[] | string | number;

export type Webhook = {
  id: number;
  url: string;
  category: number;
  sub_category: number;
  active: boolean;
  api_key: string;
  secret: string;
  created_at: string;
  updated_at: string;
};
