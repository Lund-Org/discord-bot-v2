import { GAME_TYPE } from '../types';

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

export const GAME_FIELDS = [
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
];

export const GAME_FIELDS_WITH_IMAGES = [
  ...GAME_FIELDS,
  'cover.url',
  'game_localizations',
];

export const gameTypeMapping: Partial<Record<GAME_TYPE, string>> = {
  [GAME_TYPE.MAIN_GAME]: 'Jeu',
  [GAME_TYPE.DLC_ADDON]: 'DLC',
  [GAME_TYPE.EXPANSION]: 'Extension',
  [GAME_TYPE.BUNDLE]: 'Bundle',
  [GAME_TYPE.STANDALONE_EXPANSION]: 'Standalone',
  [GAME_TYPE.MOD]: 'Mod',
  [GAME_TYPE.EPISODE]: 'Episode',
  [GAME_TYPE.SEASON]: 'Saison',
  [GAME_TYPE.REMAKE]: 'Remake',
  [GAME_TYPE.REMASTER]: 'Remaster',
  [GAME_TYPE.PORT]: 'Portage',
} as const;
