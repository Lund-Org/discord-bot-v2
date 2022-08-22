import { Request, Response } from 'express';
import { getCardsToFusion } from '@discord-bot-v2/common';

export const getUserFusions = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.params.discordId) {
    res.json([]);
  }

  const fusions = await getCardsToFusion(req.params.discordId);

  res.json(fusions);
};
