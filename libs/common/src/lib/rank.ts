import { prisma } from '@discord-bot-v2/prisma';

type XpByUser = {
  playerId: number;
  currentXP: number;
  id: number;
  discordId: string;
  twitch_username: string | null;
  points: number;
  lastMessageDate: Date;
  lastDailyDraw: Date | null;
  joinDate: Date;
};
type EnrichXpByUser = XpByUser & { position: number };
type RankByUser = {
  level: { currentLevel: number; xpNextLevel: number };
} & EnrichXpByUser;

// To redo, optimize...
export async function getGlobalRanking(
  userToFilter: number[] = []
): Promise<RankByUser[]> {
  const xpConfig = await prisma.config.findUnique({
    where: { name: 'CARD_XP' },
  });
  const levelsConfig = await prisma.config.findUnique({
    where: { name: 'LEVELS' },
  });

  if (!xpConfig || !levelsConfig) {
    return [];
  }

  const xpVal = xpConfig.value as { gold: number; basic: number };
  const xpByUsers: XpByUser[] = await prisma.$queryRaw`
    SELECT
      t1.playerId,
      SUM(t1.price * t1.level) AS currentXP,
      Player.*
    FROM (
      SELECT
        PlayerInventory.playerId,
        PlayerInventory.cardTypeId,
        PlayerInventory.type,
        CASE WHEN PlayerInventory.type = "gold" THEN ${xpVal.gold} ELSE ${xpVal.basic} END AS price,
        CardType.level
      FROM PlayerInventory
      LEFT JOIN CardType ON CardType.id = PlayerInventory.cardTypeId
      GROUP BY playerId, cardTypeId, type
    ) as t1
    LEFT JOIN Player on Player.id = t1.playerId
    GROUP BY playerId
    ORDER BY currentXP DESC`;

  const enrichAndFilteredXpByUsers: EnrichXpByUser[] = xpByUsers
    .map((xpByUser, index) => ({
      ...xpByUser,
      position: index + 1,
    }))
    .filter((xpByUser) => {
      return userToFilter.length ? userToFilter.includes(xpByUser.id) : true;
    });
  const levelConfig = levelsConfig.value as Record<string, number>;

  return enrichAndFilteredXpByUsers.map((xpByUser: EnrichXpByUser) => {
    const level = Object.values(levelConfig).reduce(
      (acc, val: number, index: number) => {
        if (val <= xpByUser.currentXP) {
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
      { currentLevel: 1, xpNextLevel: 0 }
    );

    return {
      ...xpByUser,
      level,
      lastMessageDate: new Date(xpByUser.lastMessageDate),
      lastDailyDraw: xpByUser.lastDailyDraw
        ? new Date(xpByUser.lastDailyDraw)
        : null,
      joinDate: new Date(xpByUser.joinDate),
    };
  });
}
