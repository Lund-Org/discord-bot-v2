import { Request, Response } from 'express';
import { getGlobalRanking } from '@discord-bot-v2/common';

export const getUserRanks = async (
  req: Request,
  res: Response
): Promise<void> => {
  const ranks = await getGlobalRanking();

  res.json(ranks);
};
