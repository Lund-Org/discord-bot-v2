import { prisma } from '@discord-bot-v2/prisma';

import { addPoints } from './player';

export const givenPointsForBirthday = 6000;

export async function giftPointsForBirthday(
  discordId: string
): Promise<boolean> {
  const user = await prisma.user.getPlayer(discordId);

  if (user?.player) {
    // to handle concurrency
    await addPoints(user.player.id, givenPointsForBirthday);
    return true;
  }
  return false;
}
