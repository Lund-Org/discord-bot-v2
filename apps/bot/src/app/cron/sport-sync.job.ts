import { prisma } from '@discord-bot-v2/prisma';
import { SportEventCategory } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const asyncExec = promisify(exec);

export const cronTiming = '0 55 23 * * *';

const sportMapping = {
  football: SportEventCategory.FOOTBALL,
  nba: SportEventCategory.BASKET,
};

export async function cronDefinition() {
  try {
    const syncConfig = await prisma.config.findUniqueOrThrow({
      where: {
        name: 'SPORT_SYNC',
      },
    });

    const configValue = syncConfig.value as Array<{
      sport: string;
      year: number;
    }>;
    const commands = configValue.map(async (config) => {
      await prisma.sportEvent.deleteMany({
        where: {
          category: sportMapping[config.sport],
          league: {
            year: config.year,
          },
        },
      });
      return asyncExec(
        `node ./dist/cli/main.js generate-sport-events --sport ${config.sport} --year ${config.year}`
      );
    });

    await Promise.all(commands).then((output) => {
      output.forEach(({ stdout, stderr }) => {
        console.log('STDOUT ->', stdout);
        console.log('STDERR ->', stderr);
      });
    });
  } catch (err) {
    console.error('Error while synchronizing the sports data');
    console.error(err);
  }
}
