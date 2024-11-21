export type Game = {
  igdb: string;
  label: string;
  image: string;
  isBest: boolean;
};

export type Award = {
  label: string;
  games: Array<Game>;
};

export type AwardForm = {
  awards: Award[];
};
