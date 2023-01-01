import { QUERY_OPERATOR } from './constants';
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
  deleteSource = true
) {
  const targetArr = Object.entries(target);
  source[targetKey] = targetArr.find(
    ([, value]) => value === source[sourceKey]
  )?.[0];
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
