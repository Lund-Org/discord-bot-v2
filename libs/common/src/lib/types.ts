export type CardType = {
  id: number;
  name: string;
  description: string;
  level: number;
  imageName: string;
  isFusion: boolean;
  fusionDependencies: CardType[];
  lore: string;
};

export type Inventory = {
  total: number;
  type: string;
  cardType: CardType;
  player: Profile;
};

export type Rank = {
  playerId: number;
  currentXP: number;
  id: number;
  discordId: string;
  twitch_username: string | null;
  points: number;
  lastMessageDate: Date;
  lastDailyDraw: Date | null;
  joinDate: Date;
  level: { currentLevel: number; xpNextLevel: number };
  username: string;
  position: number;
};

export type AllCardsParams = {
  filters: {
    level?: number;
    fusion?: boolean;
    search?: string;
  };
};

export type AllCardsParamsKeys = 'level' | 'fusion' | 'search';

export type Profile = {
  id: number;
  username: string;
  discordId: string;
  twitch_username: string;
  points: number;
  lastMessageDate: Date;
  lastDailyDraw: Date | null;
  joinDate: Date;
  playerInventory: Inventory[];
};

export type Filters = {
  gold: boolean;
  fusion: boolean;
  filterStars: string;
  search: string;
};
