import { prisma } from '@discord-bot-v2/prisma';
import { Prisma, SportEventCategory } from '@prisma/client';
import { eventUpsert, leagueUpsert } from '../utils/prisma.helper';
import { FootballFetcher } from '../utils/sport-io-api';
import { GeneratorArg } from '../utils/types';

export const key = 'football';

const leagueData = [
  { name: 'Ligue 1', country: 'France' },
  { name: 'Ligue 2', country: 'France' },
  { name: 'La Liga', country: 'Spain' },
  { name: 'Premier League Cup', country: 'England' },
  { name: 'UEFA Champions League', country: 'World' },
];

// leagueData.length * 2
export const generate = async ({ year }: GeneratorArg) => {
  console.log('Football generation');
  const footballFetcher = new FootballFetcher();

  for (const leagueInformation of leagueData) {
    const league = await footballFetcher.getLeague(
      year,
      leagueInformation.name,
      leagueInformation.country
    );

    if (!league) {
      console.log(`Nothing found for ${leagueInformation.name} - ${year}`);
    }

    const leagueId = league.leagueId;

    const leagueData = {
      name: league.leagueName,
      logoUrl: league.leagueLogo,
      countryCode: league.countryCode || 'World',
      sportApiId: leagueId,
      year: +year,
    };
    const DBleague = await leagueUpsert({
      create: leagueData,
      update: leagueData,
      where: {
        sportApiId: leagueId,
      },
    });

    const { teams, matches } = await footballFetcher.getTeamsAndMatches(
      year,
      leagueId
    );

    console.log('Number of teams', teams.length);
    console.log('Number of matches', matches.length);

    const savedTeams = await Promise.all(
      teams.map(async (team) => {
        const teamData = {
          name: team.teamName,
          logoUrl: team.teamLogo,
          sportApiId: team.teamId,
          year: +year,
          league: { connect: { id: DBleague.id } },
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

    await Promise.all(
      matches.map(async (match) => {
        const teamA = savedTeams.find(
          ({ sportApiId }) => sportApiId === match.teamA
        );
        const teamB = savedTeams.find(
          ({ sportApiId }) => sportApiId === match.teamB
        );

        const matchData: Pick<
          Prisma.SportEventCreateInput,
          'teamA' | 'teamB' | 'category' | 'startAt' | 'imageUrl' | 'league'
        > = {
          teamA: { connect: { id: teamA.id } },
          teamB: { connect: { id: teamB.id } },
          category: SportEventCategory.FOOTBALL,
          startAt: new Date(match.startAt),
          imageUrl: match.logo,
          league: { connect: { id: DBleague.id } },
        };

        return eventUpsert({
          create: matchData,
          update: matchData,
          where: {
            category: SportEventCategory.FOOTBALL,
            leagueId: DBleague.id,
            teamAId: teamA.id,
            teamBId: teamB.id,
            startAt: new Date(match.startAt),
          },
        });
      })
    );
    console.log('Match inserted');
  }
};
