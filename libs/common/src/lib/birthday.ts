import { prisma } from '@discord-bot-v2/prisma';
import { addPoints } from './player';

export const givenPointsForBirthday = 6000;

export async function giftPointsForBirthday(
  discordId: string
): Promise<boolean> {
  const player = await prisma.player.findUnique({ where: { discordId } });

  if (player) {
    // to handle concurrency
    await addPoints(player.id, givenPointsForBirthday);
    return true;
  }
  return false;
}
