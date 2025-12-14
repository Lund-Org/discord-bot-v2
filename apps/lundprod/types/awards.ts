import { Game } from '@discord-bot-v2/igdb-front';

export type AwardGameType = Game & {
  isBest: boolean;
};

export type Award = {
  label: string;
  games: Array<AwardGameType>;
};

export type AwardForm = {
  awards: Award[];
};
