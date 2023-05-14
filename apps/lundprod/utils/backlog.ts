import { GAME_TYPE } from '@discord-bot-v2/igdb-front';
import { BacklogStatus } from '@prisma/client';

export enum TypeMap {
  GAME = 'GAME',
  DLC = 'DLC',
}

export function mapToCategory(value: TypeMap): GAME_TYPE[] {
  switch (value) {
    case TypeMap.GAME:
      return [
        GAME_TYPE.MAIN_GAME,
        GAME_TYPE.REMAKE,
        GAME_TYPE.REMASTER,
        GAME_TYPE.PORT,
      ];
    case TypeMap.DLC:
      return [GAME_TYPE.DLC_ADDON, GAME_TYPE.EXPANSION];
    default:
      return [];
  }
}

export function mapToTypeMap(categories: GAME_TYPE[]): TypeMap {
  if (
    categories.includes(GAME_TYPE.MAIN_GAME) ||
    categories.includes(GAME_TYPE.REMAKE) ||
    categories.includes(GAME_TYPE.REMASTER) ||
    categories.includes(GAME_TYPE.PORT)
  ) {
    return TypeMap.GAME;
  } else {
    return TypeMap.DLC;
  }
}

export function getBacklogStatusTranslation(status: string) {
  switch (status) {
    case BacklogStatus.WISHLIST:
      return 'Wishlist';
    case BacklogStatus.BACKLOG:
      return 'Backlog';
    case BacklogStatus.CURRENTLY:
      return 'En cours';
    case BacklogStatus.FINISHED:
      return 'Fini';
    case BacklogStatus.ABANDONED:
      return 'Abandonné';
    default:
      return 'Sans Filtre';
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
