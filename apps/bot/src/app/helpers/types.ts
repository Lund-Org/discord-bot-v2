import { CardType } from '@prisma/client';

export type CardDraw = {
  cardType: CardType;
  isGold: boolean;
};
