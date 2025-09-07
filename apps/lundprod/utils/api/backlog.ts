import { ArrayElement } from '@discord-bot-v2/common';

export const backlogItemFields = [
  'igdbGameId',
  'name',
  'game_type',
  'url',
  'status',
  'note',
  'order',
] as const;
export const backlogItemReviewFields = [
  'review',
  'duration',
  'completion',
  'completionComment',
  'pros',
  'cons',
  'rating',
] as const;

export type BacklogItemReviewFields = ArrayElement<
  typeof backlogItemReviewFields
>;
export type BacklogItemFields = ArrayElement<typeof backlogItemFields>;

export const backlogItemPrismaFields = Object.fromEntries(
  backlogItemFields.map((fieldName) => [fieldName, true]),
) as Record<BacklogItemFields, true>;

export const backlogItemReviewsPrismaFields = Object.fromEntries(
  backlogItemReviewFields.map((fieldName) => [fieldName, true]),
) as Record<BacklogItemReviewFields, true>;
