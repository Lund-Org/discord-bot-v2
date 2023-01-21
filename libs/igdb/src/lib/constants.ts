export const BASE_URL = 'https://api.igdb.com/v4';

export const GAME_PER_PAGE = 25;

export enum QUERY_OPERATOR {
  EQ = '=',
  LT = '<',
  LTE = '<=',
  GT = '>',
  GTE = '>=',
  MATCH = '~',
}

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
