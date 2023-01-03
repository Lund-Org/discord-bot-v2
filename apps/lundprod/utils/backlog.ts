import { GAME_TYPE } from '@discord-bot-v2/igdb';

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
