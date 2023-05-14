import { ArrayElement } from '@discord-bot-v2/common';

export const backlogItemFields = [
  'igdbGameId',
  'name',
  'category',
  'url',
  'status',
  'reason',
  'note',
  'rating',
  'order',
] as const;

export type BacklogItemFields = ArrayElement<typeof backlogItemFields>;

export const backlogItemPrismaFields = Object.fromEntries(
  backlogItemFields.map((fieldName) => [fieldName, true])
) as Record<BacklogItemFields, true>;
