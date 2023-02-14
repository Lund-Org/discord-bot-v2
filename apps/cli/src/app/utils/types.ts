export type GeneratorArg = {
  year: string;
  file?: string;
};

export type FootballLeague = {
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  countryCode: string;
};

export type FootballTeam = {
  teamId: number;
  teamName: string;
  teamLogo: string;
};

export type FootballMatch = {
  teamA: number;
  teamB: number;
  startAt: string;
  logo: string;
};

export type NBATeam = {
  teamId: number;
  teamName: string;
  teamLogo: string;
};

export type NBAMatch = {
  teamA: number;
  teamB: number;
  startAt: string;
  logo: string;
};

export type RaceTeam = { name: string; logo: string };

export type RaceEvent = {
  name: string;
  logo: string;
  startAt: string;
};
