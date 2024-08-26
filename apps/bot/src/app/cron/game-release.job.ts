import { getEndOfDay } from '@discord-bot-v2/common';
import {
  GAME_TYPE,
  getGame,
  getPlatformLabel,
  translateGameType,
  translateRegion,
} from '@discord-bot-v2/igdb';
import { prisma } from '@discord-bot-v2/prisma';
// import { initI18n } from '@discord-bot-v2/translation';
import { EmbedBuilder, spoiler, userMention, WebhookClient } from 'discord.js';
import { TFunction } from 'i18next';
import { chain, get } from 'lodash';

export const cronTiming = '0 0 0 * * *';

// PATCH, TO FIX
const translations = {
  region: {
    asia: 'Asie',
    australia: 'Australie',
    brazil: 'Brésil',
    china: 'Chine',
    europe: 'Europe',
    japan: 'Japon',
    korea: 'Corée',
    newZealand: 'Nouvelle Zelande',
    northAmerica: 'US',
    worldWide: 'Mondial',
  },
  gameType: {
    bundle: 'Bundle',
    dlc: 'DLC',
    episode: 'Episode',
    expansion: 'Extension',
    game: 'Jeu',
    mod: 'Mod',
    other: 'Autre',
    port: 'Portage',
    remake: 'Remake',
    remaster: 'Remaster',
    season: 'Saison',
    standalone: 'Standalone',
  },
};
const t = ((key: string) => {
  return get(translations, key);
}) as TFunction;

export async function cronDefinition() {
  // const i18n = initI18n({});
  const date = new Date();
  date.setSeconds(0);
  date.setMinutes(0);
  date.setHours(0);

  try {
    const webhookClient = new WebhookClient({
      url: process.env.EXPECTED_GAMES_WEBHOOK,
    });

    // get the release date of the day for games not cancelled
    const expectedGames = await prisma.expectedGame.findMany({
      where: {
        releaseDate: {
          date: {
            gte: date,
            lt: getEndOfDay(),
          },
        },
        cancelled: { not: true },
      },
      include: {
        releaseDate: true,
        user: true,
      },
    });

    // Remove all the expected games of the day cancelled
    await prisma.expectedGame.deleteMany({
      where: {
        releaseDate: {
          date: {
            gte: date,
            lt: getEndOfDay(),
          },
        },
        cancelled: true,
      },
    });

    const notifData = chain(expectedGames)
      .groupBy('igdbId')
      .toPairs()
      .map(([, expectedGames]) => {
        return {
          title: expectedGames[0].name,
          url: expectedGames[0].url,
          userDiscordIds: expectedGames.map(({ user }) => user.discordId),
          regions: expectedGames
            .map(
              ({ releaseDate }) => translateRegion(t, releaseDate.region),
              // translateRegion(i18n.t, releaseDate.region),
            )
            .join(', '),
          platforms: expectedGames
            .map(({ releaseDate }) => getPlatformLabel(releaseDate.platformId))
            .join(', '),
        };
      })
      .value();

    // send all the notifications
    notifData.forEach((data) => {
      const userNotifs = spoiler(
        data.userDiscordIds.map(userMention).join(' '),
      );

      const embed = new EmbedBuilder()
        .setTitle('Sortie de jeu !')
        .setColor(0xfcba03);

      embed.addFields({ name: 'Titre', value: data.title });
      embed.addFields({
        name: 'URL du jeu',
        value: data.url,
      });
      embed.addFields({
        name: 'Plate-forme',
        value: data.platforms,
      });
      embed.addFields({
        name: 'Region',
        value: data.regions,
      });

      webhookClient.send({
        username: 'BacklogBot',
        embeds: [embed],
        content: userNotifs,
      });
    });

    // Add the backlog item and remove the expected game
    for (const expectedGame of expectedGames) {
      const gameCache = await prisma.gameCache.findUnique({
        where: {
          igdbId: expectedGame.igdbId,
        },
      });
      let category = (gameCache.content as { category?: GAME_TYPE }).category;

      if (!category) {
        const game = await getGame(expectedGame.igdbId);
        category = game?.category;
      }

      await prisma
        .$transaction(async (transactionClient) => {
          if (expectedGame.addToBacklog) {
            const existingBiggestOrder =
              await transactionClient.backlogItem.findFirst({
                where: { userId: expectedGame.userId },
                orderBy: { order: 'desc' },
              });

            await transactionClient.backlogItem.upsert({
              where: {
                userId_igdbGameId: {
                  userId: expectedGame.userId,
                  igdbGameId: expectedGame.igdbId,
                },
              },
              update: {},
              create: {
                url: expectedGame.url,
                category: translateGameType(t, category),
                // category: translateGameType(i18n.t, category),
                igdbGameId: expectedGame.igdbId,
                name: expectedGame.name,
                user: { connect: { id: expectedGame.userId } },
                order: existingBiggestOrder
                  ? existingBiggestOrder.order + 1
                  : 1,
              },
            });
          }

          await transactionClient.expectedGame.delete({
            where: {
              igdbId_userId: {
                userId: expectedGame.userId,
                igdbId: expectedGame.igdbId,
              },
            },
          });
        })
        .catch(console.error);
    }
  } catch (e) {
    console.log('Cron error :');
    console.log(e);
  }
}
