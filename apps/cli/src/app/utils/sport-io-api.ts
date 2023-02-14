import axios from 'axios';
import {
  FootballLeague,
  FootballMatch,
  FootballTeam,
  FOOTBALL_COUNTRIES,
  NBAMatch,
  NBATeam,
} from './types';

class SportFetcher {
  fetchPerMinutes = 0;
  fetchMinute: number | null = null;

  constructor(private baseUrl) {}

  async request(resource: string, params: Record<string, string | number>) {
    const currentMinute = new Date().getMinutes();
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    if (this.fetchMinute === null) {
      this.fetchMinute = currentMinute;
    } else if (
      this.fetchMinute === currentMinute &&
      this.fetchPerMinutes === 10
    ) {
      await new Promise((resolve) => {
        console.log('Awaiting for the requests per seconds...');
        setTimeout(resolve, (60 - new Date().getSeconds()) * 1000);
      });
      this.fetchMinute = currentMinute;
      this.fetchPerMinutes = 0;
    } else if (this.fetchMinute !== currentMinute) {
      this.fetchMinute = currentMinute;
      this.fetchPerMinutes = 0;
    }

    this.fetchPerMinutes += 1;

    return axios({
      method: 'GET',
      url: `/${resource}?${searchParams.toString()}`,
      baseURL: this.baseUrl,
      headers: {
        'x-rapidapi-host': this.baseUrl.replace('https://', ''),
        'x-rapidapi-key': process.env.API_SPORT_IO_KEY,
      },
    });
  }
}

export class FootballFetcher {
  countries = FOOTBALL_COUNTRIES;
  footballFetcher: SportFetcher;

  constructor() {
    this.footballFetcher = new SportFetcher(
      'https://v3.football.api-sports.io'
    );
  }

  async getLeague(
    year: string,
    name: string,
    country: string
  ): Promise<FootballLeague | null> {
    const leagues = await this.footballFetcher.request('leagues', {
      season: year,
      country,
      // I don't use name here because it makes the call really long
    });

    const leagueEntity = leagues.data.response.find(
      (response) => response.league.name === name
    );

    if (!leagueEntity) {
      throw new Error(
        `Got multiple leagues with the name ${name} and year ${year} : ${leagues.data.response.length}`
      );
    }

    return {
      leagueId: leagueEntity.league.id,
      leagueName: leagueEntity.league.name,
      leagueLogo: leagueEntity.league.logo,
      countryCode: leagueEntity.country.code,
    };
  }

  async getTeamsAndMatches(
    year: string,
    leagueId: number
  ): Promise<{
    teams: FootballTeam[];
    matches: FootballMatch[];
  }> {
    const teams: Record<number, FootballTeam> = {};
    const matchResult = await this.footballFetcher.request('fixtures', {
      league: leagueId,
      timezone: 'Europe/Paris',
      season: year,
    });

    const matches = matchResult.data.response.map((matchEntity) => {
      if (!teams[matchEntity.teams.away.id]) {
        teams[matchEntity.teams.away.id] = {
          teamId: matchEntity.teams.away.id,
          teamName: matchEntity.teams.away.name,
          teamLogo: matchEntity.teams.away.logo,
        };
      }
      if (!teams[matchEntity.teams.home.id]) {
        teams[matchEntity.teams.home.id] = {
          teamId: matchEntity.teams.home.id,
          teamName: matchEntity.teams.home.name,
          teamLogo: matchEntity.teams.home.logo,
        };
      }

      return {
        teamA: matchEntity.teams.home.id,
        teamB: matchEntity.teams.away.id,
        startAt: matchEntity.fixture.date,
        logo: matchEntity.league.logo,
      };
    });

    return { matches, teams: Object.values(teams) };
  }
}

export class NBAFetcher {
  nbaFetcher: SportFetcher;

  constructor() {
    this.nbaFetcher = new SportFetcher('https://v2.nba.api-sports.io');
  }

  async getTeamsAndMatches(year: string): Promise<{
    teams: NBATeam[];
    matches: NBAMatch[];
  }> {
    const teams: Record<number, NBATeam> = {};
    const matchResult = await this.nbaFetcher.request('games', {
      season: year,
    });

    const matches = matchResult.data.response.map((matchEntity) => {
      // Set the teams if not in the list
      if (!teams[matchEntity.teams.visitors.id]) {
        teams[matchEntity.teams.visitors.id] = {
          teamId: matchEntity.teams.visitors.id,
          teamName: matchEntity.teams.visitors.name,
          teamLogo: matchEntity.teams.visitors.logo,
        };
      }
      if (!teams[matchEntity.teams.home.id]) {
        teams[matchEntity.teams.home.id] = {
          teamId: matchEntity.teams.home.id,
          teamName: matchEntity.teams.home.name,
          teamLogo: matchEntity.teams.home.logo,
        };
      }

      return {
        teamA: matchEntity.teams.home.id,
        teamB: matchEntity.teams.visitors.id,
        startAt: matchEntity.date.start,
        logo: matchEntity.teams.home.logo,
      };
    });

    return {
      teams: Object.values(teams),
      matches,
    };
  }
}
