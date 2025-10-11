import z from 'zod';
import { TServer } from '../types';
import {
  GAME_TYPE,
  getGames,
  IGDBConditionValue,
  platForms,
  QUERY_OPERATOR,
} from '@discord-bot-v2/igdb';
import { gameSchema } from '../common-schema';

const getGamesInput = z.object({
  futureGame: z.boolean().optional(),
  dlc: z.boolean(),
  query: z.string(),
  platformId: z
    .custom<number>((data) => {
      const platformIds = platForms.map(({ id }) => id);

      return platformIds.includes(data);
    })
    .optional(),
  page: z.number().gte(1).default(1).optional(),
  withImage: z.boolean().default(true).optional(),
  filters: z
    .array(
      z.object({
        field: z.string(),
        operator: z.nativeEnum(QUERY_OPERATOR),
        value: z.union([
          z.string(),
          z.number(),
          z.array(z.number()),
          z.array(z.string()),
        ]),
      }),
    )
    .optional(),
});
const getGamesOutput = z.array(gameSchema);

export type GetGamesInputType = z.infer<typeof getGamesInput>;
export type GetGamesOutputType = z.infer<typeof getGamesOutput>;

export const getGamesProcedure = (t: TServer) => {
  return t.procedure
    .input(getGamesInput)
    .output(getGamesOutput)
    .query(async ({ input }) => {
      const { query, dlc, futureGame, filters, page, platformId, withImage } =
        input;

      const queryFilters: {
        field: string;
        operator: QUERY_OPERATOR;
        value: IGDBConditionValue;
      }[] = filters || [];

      if (dlc) {
        queryFilters.push({
          field: 'game_type',
          operator: QUERY_OPERATOR.EQ,
          value: [GAME_TYPE.DLC_ADDON, GAME_TYPE.EXPANSION],
        });
      } else {
        queryFilters.push({
          field: 'game_type',
          operator: QUERY_OPERATOR.EQ,
          value: [
            GAME_TYPE.MAIN_GAME,
            GAME_TYPE.REMAKE,
            GAME_TYPE.REMASTER,
            GAME_TYPE.PORT,
            GAME_TYPE.EXPANDED_GAME,
            GAME_TYPE.BUNDLE,
            GAME_TYPE.STANDALONE_EXPANSION,
            GAME_TYPE.EXPANDED_GAME,
          ],
        });
      }

      if (futureGame) {
        queryFilters.push({
          field: 'first_release_date',
          operator: QUERY_OPERATOR.GT,
          value: Math.floor(Date.now() / 1000),
        });
      } else {
        queryFilters.push({
          field: 'first_release_date',
          operator: QUERY_OPERATOR.GT,
          value: 1,
        });
        queryFilters.push({
          field: 'first_release_date',
          operator: QUERY_OPERATOR.LTE,
          value: Math.floor(Date.now() / 1000),
        });
      }

      if (platformId) {
        queryFilters.push({
          field: 'platforms',
          operator: QUERY_OPERATOR.EQ,
          value: platformId,
        });
      }

      const games = await getGames(query, queryFilters, page, withImage);

      return games;
    });
};
