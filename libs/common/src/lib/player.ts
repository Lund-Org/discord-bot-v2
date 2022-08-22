import { prisma } from '@discord-bot-v2/prisma';

export async function addPoints(playerId: number, points: number) {
  if (points === 0) {
    return;
  }

  return prisma.player.update({
    where: { id: playerId },
    data: {
      points: {
        increment: points,
      },
    },
  });
}
