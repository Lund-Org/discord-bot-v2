import { Request, Response } from 'express';
import { getCardsToGold as _getCardsToGold } from '@discord-bot-v2/common';

export const getCardsToGold = async (
  req: Request,
  res: Response
): Promise<void> => {
  const cardsToGold = await _getCardsToGold(req.params.id);

  res.json(cardsToGold);
};
