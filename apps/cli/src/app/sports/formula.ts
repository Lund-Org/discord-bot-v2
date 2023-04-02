import { prisma } from '@discord-bot-v2/prisma';
import { SportEventCategory } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

import { eventUpsert, leagueUpsert } from '../utils/prisma.helper';
import { GeneratorArg, RaceEvent, RaceTeam } from '../utils/types';

const keyF1 = 'f1';
const keyF2 = 'f2';
const keyF3 = 'f3';
const keyFE = 'fe';

/**
 * JSON file format
 *
 * {
 *    "teams": { "name": string; "logo": string }[],
 *    "races": { "name": string; "logo": string, "startAt": string }[]
 * }
 */

async function generate(year: string, file: string, name: string) {
  const data = JSON.parse(readFileSync(join(process.cwd(), file)).toString());

  if (!data.teams) {
    throw new Error('The `teams` key is missing');
  }
  if (!data.races) {
    throw new Error('The `races` key is missing');
  }

  const championshipData = {
    name,
    logoUrl: `https://d18wazra96xhgb.cloudfront.net/sports/${name}-logo.jpg`,
    countryCode: 'World',
    sportApiId: +year,
    year: +year,
  };
  const championship = await leagueUpsert({
    create: championshipData,
    update: championshipData,
    where: {
      name,
      year: +year,
    },
  });

  await Promise.all(
    data.teams.map(({ name, logo }: RaceTeam) => {
      const team = {
        name,
        logoUrl: logo,
        sportApiId: +year,
        year: +year,
        league: { connect: { id: championship.id } },
      };
      return prisma.sportTeam.upsert({
        create: team,
        update: team,
        where: {
          name_sportApiId_year: {
            name,
            sportApiId: +year,
            year: +year,
          },
        },
      });
    })
  );

  await Promise.all(
    data.races.map(({ name, logo, startAt }: RaceEvent) => {
      const event = {
        name,
        startAt: startAt,
        category: SportEventCategory.MOTORSPORT,
        imageUrl: logo,
        league: { connect: { id: championship.id } },
      };
      return eventUpsert({
        create: event,
        update: event,
        where: {
          name,
          leagueId: championship.id,
        },
      });
    })
  );
}

const generateF1 = ({ year, file }: GeneratorArg) => {
  return generate(year, file, 'F1');
};

const generateF2 = ({ year, file }: GeneratorArg) => {
  return generate(year, file, 'F2');
};

const generateF3 = ({ year, file }: GeneratorArg) => {
  return generate(year, file, 'F3');
};

const generateFE = ({ year, file }: GeneratorArg) => {
  return generate(year, file, 'FE');
};

export const f1 = {
  key: keyF1,
  generate: generateF1,
};

export const f2 = {
  key: keyF2,
  generate: generateF2,
};

export const f3 = {
  key: keyF3,
  generate: generateF3,
};

export const fe = {
  key: keyFE,
  generate: generateFE,
};
