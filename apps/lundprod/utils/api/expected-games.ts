import { ArrayElement } from '@discord-bot-v2/common';
import { REGION } from '@discord-bot-v2/igdb-front';
import { ExpectedGame as PrismaExpectedGame, Prisma } from '@prisma/client';

export const expectedGamesFields = [
  'id',
  'igdbId',
  'name',
  'url',
  'addToBacklog',
  'cancelled',
] as const;

export type ExpectedGamesFields = ArrayElement<typeof expectedGamesFields>;

export const expectedGamesPrismaFields = Object.fromEntries(
  expectedGamesFields.map((fieldName) => [fieldName, true])
) as Record<ExpectedGamesFields, true>;

export const expectedGamesPrismaSelect =
  Prisma.validator<Prisma.ExpectedGameSelect>()({
    ...expectedGamesPrismaFields,
    releaseDate: {
      select: {
        date: true,
        platformId: true,
        region: true,
      },
    },
  });

export type ExpectedGame = Pick<PrismaExpectedGame, ExpectedGamesFields> & {
  releaseDate: { date: Date; platformId: number; region: REGION };
};
