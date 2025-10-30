import { set } from 'lodash';

export function convertTs<T extends { createdAt: Date; updatedAt: Date }>(
  item: T,
  fields: Array<keyof T> = ['createdAt', 'updatedAt'] as const,
) {
  const newItem = { ...item };

  for (const key of fields) {
    set(
      newItem,
      key,
      newItem[key] ? (newItem[key] as unknown as Date).toISOString() : null,
    );
  }

  return newItem as T & Record<keyof T, string | null>;
}
