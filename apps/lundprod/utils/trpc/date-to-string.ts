import { get, set } from 'lodash';

export function convertTs<T extends { createdAt: Date; updatedAt: Date }>(
  item: T,
  fields: Array<keyof T | string> = ['createdAt', 'updatedAt'] as const,
) {
  const newItem = { ...item };

  for (const key of fields) {
    set(
      newItem,
      key,
      get(newItem, key)
        ? (get(newItem, key) as unknown as Date).toISOString()
        : null,
    );
  }

  return newItem as T & Record<keyof T, string | null>;
}
