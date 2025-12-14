import { TFunction } from 'i18next';

import {
  GAME_TYPE,
  GameTypeTranslation,
  IGDBConditionValue,
  REGION,
} from '../types';
import { QUERY_OPERATOR } from './constants';

export function validateFilters(filters: unknown): filters is {
  field: string;
  operator: QUERY_OPERATOR;
  value: IGDBConditionValue;
}[] {
  if (!Array.isArray(filters)) {
    return false;
  }

  return filters.every((filter) => {
    const hasRightFields =
      'field' in filter && 'operator' in filter && 'value' in filter;

    if (!hasRightFields) {
      return false;
    }

    if (!Object.values(QUERY_OPERATOR).includes(filter.operator)) {
      return false;
    }
    return (
      typeof filter.value === 'string' ||
      typeof filter.value === 'number' ||
      (Array.isArray(filter.value) &&
        (filter.value.every((v: unknown) => typeof v === 'string') ||
          filter.value.every((v: unknown) => typeof v === 'number')))
    );
  });
}

export const translateRegion = (tFn: TFunction, region: REGION | undefined) => {
  switch (region) {
    case REGION.EUROPE:
      return tFn('region.europe');
    case REGION.NORTH_AMERICA:
      return tFn('region.northAmerica');
    case REGION.AUSTRALIA:
      return tFn('region.australia');
    case REGION.NEW_ZEALAND:
      return tFn('region.newZealand');
    case REGION.JAPAN:
      return tFn('region.japan');
    case REGION.CHINA:
      return tFn('region.china');
    case REGION.ASIA:
      return tFn('region.asia');
    case REGION.KOREA:
      return tFn('region.korea');
    case REGION.BRAZIL:
      return tFn('region.brazil');
    case REGION.WORLDWIDE:
    default:
      return tFn('region.worldWide');
  }
};

export const translateGameType = (
  tFn: TFunction,
  gameType: GAME_TYPE,
): GameTypeTranslation => {
  switch (gameType) {
    case GAME_TYPE.MAIN_GAME:
    case GAME_TYPE.EXPANDED_GAME:
      return tFn('gameType.game');
    case GAME_TYPE.DLC_ADDON:
      return tFn('gameType.dlc');
    case GAME_TYPE.EXPANSION:
      return tFn('gameType.expansion');
    case GAME_TYPE.BUNDLE:
      return tFn('gameType.bundle');
    case GAME_TYPE.STANDALONE_EXPANSION:
      return tFn('gameType.standalone');
    case GAME_TYPE.MOD:
      return tFn('gameType.mod');
    case GAME_TYPE.EPISODE:
      return tFn('gameType.episode');
    case GAME_TYPE.SEASON:
      return tFn('gameType.season');
    case GAME_TYPE.REMAKE:
      return tFn('gameType.remake');
    case GAME_TYPE.REMASTER:
      return tFn('gameType.remaster');
    case GAME_TYPE.PORT:
      return tFn('gameType.port');
    default:
      return tFn('gameType.other');
  }
};
