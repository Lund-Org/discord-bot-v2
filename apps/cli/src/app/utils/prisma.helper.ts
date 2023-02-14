import { prisma } from '@discord-bot-v2/prisma';
import { Prisma } from '@prisma/client';

type EventUpsertNotUnique = Omit<Prisma.SportEventUpsertArgs, 'where'> & {
  where: Prisma.SportEventWhereInput;
};
type LeagueUpsertNotUnique = Omit<Prisma.SportLeagueUpsertArgs, 'where'> & {
  where: Prisma.SportLeagueWhereInput;
};
type TeamUpsertNotUnique = Omit<Prisma.SportTeamUpsertArgs, 'where'> & {
  where: Prisma.SportTeamWhereInput;
};

export async function eventUpsert({
  create,
  update,
  where,
}: EventUpsertNotUnique) {
  const item = await prisma.sportEvent.findFirst({ where });

  if (item) {
    return prisma.sportEvent.update({
      where: { id: item.id },
      data: update,
    });
  } else {
    return prisma.sportEvent.create({
      data: create,
    });
  }
}

export async function leagueUpsert({
  create,
  update,
  where,
}: LeagueUpsertNotUnique) {
  const item = await prisma.sportLeague.findFirst({ where });

  if (item) {
    return prisma.sportLeague.update({
      where: { id: item.id },
      data: update,
    });
  } else {
    return prisma.sportLeague.create({
      data: create,
    });
  }
}

export async function teamUpsert({
  create,
  update,
  where,
}: TeamUpsertNotUnique) {
  const item = await prisma.sportTeam.findFirst({ where });

  if (item) {
    return prisma.sportTeam.update({
      where: { id: item.id },
      data: update,
    });
  } else {
    return prisma.sportTeam.create({
      data: create,
    });
  }
}
