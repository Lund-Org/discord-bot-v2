import { CardType } from '@discord-bot-v2/prisma';

export type CardDraw = {
  cardType: CardType;
  isGold: boolean;
};
