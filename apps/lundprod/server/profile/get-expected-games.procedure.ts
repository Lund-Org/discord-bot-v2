import z from 'zod';
import { TServer } from '../types';
import { BacklogStatus, Prisma } from '@prisma/client';
import { prisma } from '@discord-bot-v2/prisma';
import { backlogItemSchema, expectedGameSchema } from '../common-schema';
import { getAuthedProcedure } from '../middleware';

const ITEMS_PER_PAGE = 30;

const expectedGameData = Prisma.validator<Prisma.ExpectedGameDefaultArgs>()({
  omit: {
    userId: true,
  },
  include: {
    releaseDate: {
      omit: {
        expectedGameId: true,
      },
    },
  },
});

type ExpectedGameType = Prisma.ExpectedGameGetPayload<typeof expectedGameData>;

const getExpectedGamesInput = z.object({
  page: z.number().gte(1).optional(),
  discordId: z.string(),
});
const getMyExpectedGamesInput = z.object({});
const getExpectedGamesOutput = z.array(expectedGameSchema);

export type GetExpectedGamesInputType = z.infer<typeof getExpectedGamesInput>;
export type GetExpectedGamesOutputType = z.infer<typeof getExpectedGamesOutput>;

export const getExpectedGamesProcedure = (t: TServer) => {
  return t.procedure
    .input(getExpectedGamesInput)
    .output(getExpectedGamesOutput)
    .query(getExpectedGamesByDiscordId);
};
export const getMyExpectedGamesProcedure = (t: TServer) => {
  return getAuthedProcedure(t)
    .input(getMyExpectedGamesInput)
    .output(getExpectedGamesOutput)
    .query(async ({ input, ctx }) => {
      const { session } = ctx;

      const expectedGames = await prisma.expectedGame.findMany({
        where: {
          user: {
            discordId: session.userId,
          },
        },
        include: expectedGameData.include,
        omit: expectedGameData.omit,
      });

      return expectedGames.map(convert);
    });
};

const getExpectedGamesByDiscordId = async ({
  input,
}: {
  input: GetExpectedGamesInputType;
}) => {
  const { discordId, page = 1 } = input;
  const expectedGames = await prisma.expectedGame.findMany({
    where: {
      user: {
        discordId,
      },
    },
    include: expectedGameData.include,
    omit: expectedGameData.omit,
    take: ITEMS_PER_PAGE,
    skip: ITEMS_PER_PAGE * (page - 1),
  });

  return expectedGames.map(convert);
};

function convert(
  expectedGame: ExpectedGameType,
): z.infer<typeof expectedGameSchema> {
  return {
    ...expectedGame,
    releaseDate: expectedGame.releaseDate
      ? {
          ...expectedGame.releaseDate,
          date: expectedGame.releaseDate.date
            ? expectedGame.releaseDate.date.toISOString()
            : null,
        }
      : null,
    createdAt: expectedGame.createdAt.toISOString(),
    updatedAt: expectedGame.updatedAt.toISOString(),
  };
}
