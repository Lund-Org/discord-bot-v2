import { PrismaClient, SportLeague } from '@prisma/client';

type LastLeague = SportLeague & {
  maxYear: number;
};

export const SportLeagueExtension = (prisma: PrismaClient) => ({
  getLastYearLeagues: async (): Promise<LastLeague[]> => {
    return prisma.$queryRaw<LastLeague[]>`
      SELECT * FROM (
        SELECT *, MAX(year) over (partition by name) maxYear
        FROM SportLeague
      ) as t
      WHERE year = maxYear
      ORDER BY name ASC
    `;
  },
});
