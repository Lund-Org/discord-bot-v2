import { prisma } from '@discord-bot-v2/prisma';
import { GachaPlayer } from '@prisma/client';

import { GachaConfigEnum } from './gacha-enum';
import { CardXPConfig } from './types';

type XpByPlayer = GachaPlayer & {
  playerId: number;
  currentXP: number;
  totalCards: number;
  discordId: string;
  username: string;
};
type EnrichXpByPlayer = XpByPlayer & { position: number };
export type RankByUser = {
  level: {
    currentLevel: number;
    xpNextLevel: number;
  };
  hasFinishGame: boolean;
} & EnrichXpByPlayer;

// To redo, optimize, retype...
export async function getGlobalRanking(
  playerToFilter: number[] = [],
): Promise<RankByUser[]> {
  const xpConfig = await prisma.config.findUnique({
    where: { name: GachaConfigEnum.CARD_XP },
  });
  const levelsConfig = await prisma.config.findUnique({
    where: { name: GachaConfigEnum.LEVELS },
  });

  if (!xpConfig || !levelsConfig) {
    return [];
  }

  const xpVal = xpConfig.value as CardXPConfig;
  const xpByPlayers: XpByPlayer[] = await prisma.$queryRaw`
    SELECT
      t1.playerId,
      SUM(t1.price * t1.level) AS currentXP,
      GachaPlayer.*,
      User.discordId,
      User.username,
      COUNT(playerId) as totalCards
    FROM (
      SELECT
        GachaPlayerInventory.playerId,
        GachaPlayerInventory.cardTypeId,
        GachaPlayerInventory.type,
        CASE WHEN GachaPlayerInventory.type = "gold" THEN ${xpVal.gold} ELSE ${xpVal.basic} END AS price,
        CardType.level
      FROM GachaPlayerInventory
      LEFT JOIN CardType ON CardType.id = GachaPlayerInventory.cardTypeId
      WHERE total > 0
      GROUP BY playerId, cardTypeId, type
    ) as t1
    LEFT JOIN GachaPlayer on Player.id = t1.playerId
    LEFT JOIN User on User.id = Player.userId
    GROUP BY playerId
    ORDER BY currentXP DESC, finishRank ASC`;
  const totalCardsInGame = (await prisma.cardType.count()) * 2;

  const enrichAndFilteredXpByPlayers: EnrichXpByPlayer[] = xpByPlayers
    .map((xpByPlayer, index) => ({
      ...xpByPlayer,
      position: index + 1,
    }))
    .filter((xpByPlayer) => {
      return playerToFilter.length
        ? playerToFilter.includes(xpByPlayer.id)
        : true;
    });
  const levelConfig = levelsConfig.value as Record<string, number>;

  return enrichAndFilteredXpByPlayers.map((xpByPlayer: EnrichXpByPlayer) => {
    const level = Object.values(levelConfig).reduce(
      (acc, val: number, index: number) => {
        if (val <= xpByPlayer.currentXP) {
          return {
            currentLevel: index + 1,
            xpNextLevel:
              Object.values(levelConfig).length === index + 1
                ? 0
                : Object.values(levelConfig)[index + 1],
          };
        }

        return acc;
      },
      { currentLevel: 1, xpNextLevel: 0 },
    );

    return {
      ...xpByPlayer,
      totalCards: Number(xpByPlayer.totalCards), // because it's a bigint
      level,
      hasFinishGame: Number(totalCardsInGame) === Number(xpByPlayer.totalCards),
      lastMessageDate: new Date(xpByPlayer.lastMessageDate),
      lastDailyDraw: xpByPlayer.lastDailyDraw
        ? new Date(xpByPlayer.lastDailyDraw)
        : null,
      joinDate: new Date(xpByPlayer.joinDate),
    };
  });
}
