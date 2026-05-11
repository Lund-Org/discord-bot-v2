import {
  CardType,
  GachaPlayer,
  GachaPlayerInventory,
  User,
} from '@prisma/client';

//-- Gacha types

export type CardWithFusionDependencies = Omit<
  CardType,
  'createdAt' | 'updatedAt'
> & {
  fusionDependencies: Omit<CardType, 'createdAt' | 'updatedAt'>[];
};

export type Filters = {
  gold: boolean;
  fusion: boolean;
  filterStars: string;
  search: string;
};

export type ProfileType = User & {
  gachaPlayer?: GachaPlayer & {
    gachaPlayerInventory?: (GachaPlayerInventory & {
      cardType: CardType;
    })[];
  };
};

export type CardsToGoldType = (GachaPlayerInventory & {
  cardType: CardType;
})[];

export type Rank = GachaPlayer & {
  username: string;
  discordId: string;
  playerId: number;
  currentXP: number;
  level: { currentLevel: number; xpNextLevel: number };
  position: number;
};
