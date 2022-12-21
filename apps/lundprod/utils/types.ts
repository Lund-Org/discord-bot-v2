import { CardType, Player, PlayerInventory } from '@prisma/client';

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type CardWithFusionDependencies = CardType & {
  fusionDependencies: CardType[];
};

export type Filters = {
  gold: boolean;
  fusion: boolean;
  filterStars: string;
  search: string;
};

export type ProfileType = Player & {
  playerInventory: (PlayerInventory & {
    cardType: CardType;
  })[];
};

export type CardsToGoldType = (PlayerInventory & {
  cardType: CardType;
})[];

export type Rank = Player & {
  playerId: number;
  currentXP: number;
  level: { currentLevel: number; xpNextLevel: number };
  position: number;
};
