import { GAME_TYPE } from '@discord-bot-v2/igdb-front';
import {
  BacklogItem,
  BacklogItemReview,
  BacklogItemReviewCons,
  BacklogItemReviewPros,
  BacklogStatus,
} from '@prisma/client';
import { TFunction } from 'i18next';

import { BacklogItemFields, BacklogItemReviewFields } from './api/backlog';

export enum TypeMap {
  GAME = 'GAME',
  DLC = 'DLC',
}

export function convertPrismaToBacklogItem(
  item: Pick<BacklogItem, BacklogItemFields> & {
    backlogItemReview?:
      | (Pick<
          BacklogItemReview,
          Exclude<BacklogItemReviewFields, 'pros' | 'cons'>
        > & {
          pros: Pick<BacklogItemReviewPros, 'value'>[];
          cons: Pick<BacklogItemReviewCons, 'value'>[];
        })
      | null;
  },
) {
  return {
    ...item,
    ...item.backlogItemReview,
    pros: item.backlogItemReview?.pros.map(({ value }) => value) || [],
    cons: item.backlogItemReview?.cons.map(({ value }) => value) || [],
  };
}

export function mapToTypeMap(categories: GAME_TYPE[]): TypeMap {
  if (
    categories.includes(GAME_TYPE.MAIN_GAME) ||
    categories.includes(GAME_TYPE.EXPANDED_GAME) ||
    categories.includes(GAME_TYPE.REMAKE) ||
    categories.includes(GAME_TYPE.REMASTER) ||
    categories.includes(GAME_TYPE.PORT)
  ) {
    return TypeMap.GAME;
  } else {
    return TypeMap.DLC;
  }
}

export function getBacklogStatusTranslation(tFn: TFunction, status: string) {
  switch (status) {
    case BacklogStatus.WISHLIST:
      return tFn('mySpace.backlog.status.wishlist');
    case BacklogStatus.BACKLOG:
      return tFn('mySpace.backlog.status.backlog');
    case BacklogStatus.CURRENTLY:
      return tFn('mySpace.backlog.status.inProgress');
    case BacklogStatus.FINISHED:
      return tFn('mySpace.backlog.status.finished');
    case BacklogStatus.ABANDONED:
      return tFn('mySpace.backlog.status.abandoned');
    default:
      return tFn('mySpace.backlog.status.noFilter');
  }
}
export function getBacklogStatusColor(status: BacklogStatus) {
  switch (status) {
    case BacklogStatus.WISHLIST:
      return 'yellow';
    case BacklogStatus.BACKLOG:
      return 'orange';
    case BacklogStatus.CURRENTLY:
      return 'cyan';
    case BacklogStatus.FINISHED:
      return 'green';
    case BacklogStatus.ABANDONED:
      return 'red';
  }
}
