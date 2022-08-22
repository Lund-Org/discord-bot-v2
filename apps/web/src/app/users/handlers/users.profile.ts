import { Request, Response } from 'express';
import { getProfile } from '@discord-bot-v2/common';

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const profile = await getProfile(req.params.id);

  res.json(profile);
};
