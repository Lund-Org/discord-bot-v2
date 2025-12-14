import { CardType, Player, PlayerInventory, User } from '@prisma/client';

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
  player?: Player & {
    playerInventory?: (PlayerInventory & {
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
