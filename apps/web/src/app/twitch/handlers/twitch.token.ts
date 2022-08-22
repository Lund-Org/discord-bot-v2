import { prisma } from '@discord-bot-v2/prisma';
import { Request, Response } from 'express';

export const postTwitchToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (req.query.token && req.query.token.length === 30) {
    const payload = {
      name: 'TWITCH_TOKENS',
      value: {
        accessToken: req.query.token,
        refreshToken: null,
        expiryDate: null,
      },
    };

    await prisma.config.upsert({
      where: { name: 'TWITCH_TOKENS' },
      create: payload,
      update: payload,
    });

    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
};
