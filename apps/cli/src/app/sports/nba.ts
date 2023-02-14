import { prisma } from '@discord-bot-v2/prisma';
import { SportEventCategory } from '@prisma/client';
import { eventUpsert, leagueUpsert } from '../utils/prisma.helper';
import { NBAFetcher } from '../utils/sport-io-api';
import { GeneratorArg } from '../utils/types';

export const key = 'nba';

// 1 call per generation
export const generate = async ({ year }: GeneratorArg) => {
  console.log('NBA generation');
  const nbaFetcher = new NBAFetcher();

  const { matches, teams } = await nbaFetcher.getTeamsAndMatches(year);

  const nbaLeagueId = await getNBALeagueOrGenerateIt(year);

  const savedTeams = await Promise.all(
    teams.map(async (team) => {
      const teamData = {
        name: team.teamName,
        logoUrl: team.teamLogo,
        sportApiId: team.teamId,
        year: +year,
        league: { connect: { id: nbaLeagueId } },
      };

      return prisma.sportTeam.upsert({
        create: teamData,
        update: teamData,
        where: {
          name_sportApiId_year: {
            name: team.teamName,
            sportApiId: team.teamId,
            year: +year,
          },
        },
      });
    })
  );
  console.log('Team inserted');

  await Promise.all(
    matches.map(async (match) => {
      const teamA = savedTeams.find(
        ({ sportApiId }) => sportApiId === match.teamA
      );
      const teamB = savedTeams.find(
        ({ sportApiId }) => sportApiId === match.teamB
      );

      const matchData = {
        teamA: { connect: { id: teamA.id } },
        teamB: { connect: { id: teamB.id } },
        category: SportEventCategory.BASKET,
        startAt: new Date(match.startAt),
        imageUrl: match.logo,
        league: { connect: { id: nbaLeagueId } },
      };

      return eventUpsert({
        create: matchData,
        update: matchData,
        where: {
          category: SportEventCategory.BASKET,
          leagueId: nbaLeagueId,
          teamAId: match.teamA,
          teamBId: match.teamB,
          startAt: new Date(match.startAt),
        },
      });
    })
  );
  console.log('Match inserted');
};

async function getNBALeagueOrGenerateIt(year: string): Promise<number> {
  const data = {
    name: 'NBA',
    logoUrl: 'https://d18wazra96xhgb.cloudfront.net/sports/nba-logo.jpg',
    countryCode: 'US',
    sportApiId: null,
    year: +year,
  };

  const NBALeague = await leagueUpsert({
    create: data,
    update: data,
    where: {
      name: 'NBA',
      year: +year,
    },
  });

  return NBALeague.id;
}
