import {
  ConditionValue,
  GAME_STATUS,
  platForms,
  QUERY_OPERATOR,
  REGION,
} from '@discord-bot-v2/igdb';
import { CardType, Player, PlayerInventory, User } from '@prisma/client';

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

//-- Gacha types

export type CardWithFusionDependencies = CardType & {
  fusionDependencies: CardType[];
};

export type Filters = {
  gold: boolean;
  fusion: boolean;
  filterStars: string;
  search: string;
};

export type ProfileType = User & {
  player: Player & {
    playerInventory: (PlayerInventory & {
      cardType: CardType;
    })[];
  };
};

export type CardsToGoldType = (PlayerInventory & {
  cardType: CardType;
})[];

export type Rank = Player & {
  username: string;
  discordId: string;
  playerId: number;
  currentXP: number;
  level: { currentLevel: number; xpNextLevel: number };
  position: number;
};

//-- IGDB

export type IGDBFilter = {
  field: string;
  operator: QUERY_OPERATOR;
  value: ConditionValue;
};

export type ListGamesSearch = {
  search: string;
  filters: IGDBFilter[];
};

export type IGDBPlatform = ArrayElement<typeof platForms>;
