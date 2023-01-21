import { GAME_TYPE, QUERY_OPERATOR, REGION } from './constants';
import { ConditionValue } from './igdb-query-builder';

export function linkArrayData(
  source,
  target,
  sourceKey: string,
  targetKey: string,
  deleteSource = true
) {
  source[targetKey] = (source[sourceKey] || []).map((_id) => {
    return target.find(({ id }) => id === _id);
  });
  if (deleteSource && sourceKey !== targetKey) {
    delete source[sourceKey];
  }
}
export function linkValueToArrayData(
  source,
  target,
  sourceKey: string,
  targetKey: string,
  deleteSource = true
) {
  source[targetKey] = target.find(({ id }) => id === source[sourceKey]);
  if (deleteSource && sourceKey !== targetKey) {
    delete source[sourceKey];
  }
}
export function linkEnumData(
  source,
  target,
  sourceKey: string,
  targetKey: string,
  translationFn?: (value) => string,
  deleteSource = true
) {
  const targetArr = Object.entries(target);
  const value = targetArr.find(([, value]) => value === source[sourceKey]);

  source[targetKey] =
    value && translationFn ? translationFn(value[1]) : value?.[0];

  if (deleteSource && sourceKey !== targetKey) {
    delete source[sourceKey];
  }
}

export function validateFilters(filters: unknown): filters is {
  field: string;
  operator: QUERY_OPERATOR;
  value: ConditionValue;
}[] {
  if (!Array.isArray(filters)) {
    return null;
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
        (filter.value.every((v) => typeof v === 'string') ||
          filter.value.every((v) => typeof v === 'number')))
    );
  });
}

export const translateRegion = (region: REGION) => {
  switch (region) {
    case REGION.EUROPE:
      return 'Europe';
    case REGION.NORTH_AMERICA:
      return 'US';
    case REGION.AUSTRALIA:
      return 'Australie';
    case REGION.NEW_ZEALAND:
      return 'Nouvelle Zelande';
    case REGION.JAPAN:
      return 'Japon';
    case REGION.CHINA:
      return 'Chine';
    case REGION.ASIA:
      return 'Asie';
    case REGION.WORLDWIDE:
      return 'Mondial';
    case REGION.KOREA:
      return 'Corée';
    case REGION.BRAZIL:
      return 'Brésil';
  }
};

export const translateGameType = (gameType: GAME_TYPE) => {
  switch (gameType) {
    case GAME_TYPE.MAIN_GAME:
      return 'Jeu';
    case GAME_TYPE.DLC_ADDON:
      return 'DLC';
    case GAME_TYPE.EXPANSION:
      return 'Extension';
    case GAME_TYPE.BUNDLE:
      return 'Bundle';
    case GAME_TYPE.STANDALONE_EXPANSION:
      return 'Standalone';
    case GAME_TYPE.MOD:
      return 'Mod';
    case GAME_TYPE.EPISODE:
      return 'Episode';
    case GAME_TYPE.SEASON:
      return 'Saison';
    case GAME_TYPE.REMAKE:
      return 'Remake';
    case GAME_TYPE.REMASTER:
      return 'Remaster';
    case GAME_TYPE.PORT:
      return 'Portage';
    default:
      return 'Autre';
  }
};
