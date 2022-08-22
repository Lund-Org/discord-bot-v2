import { Request, Response } from 'express';
import { prisma } from '@discord-bot-v2/prisma';

export const getManyCards = async (
  req: Request,
  res: Response
): Promise<void> => {
  const filters: Record<string, unknown> = {};

  if (req.query.filters) {
    const filterParams = JSON.parse(req.query.filters.toString());

    if (filterParams.fusion) {
      filters.fusion = true;
    }
    if (filterParams.level) {
      filters.level = filterParams.level;
    }
    if (filterParams.search) {
      filters.name = { contains: filterParams.search };
    }
  }

  const cardTypes = await prisma.cardType.findMany({
    where: filters,
    include: {
      fusionDependencies: true,
    },
  });

  res.json(cardTypes);
};
