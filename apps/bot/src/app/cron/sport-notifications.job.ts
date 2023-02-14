import { prisma } from '@discord-bot-v2/prisma';
import { getEndOfDay } from '@discord-bot-v2/common';
import {
  Client,
  spoiler,
  userMention,
  EmbedBuilder,
  TextChannel,
} from 'discord.js';
import { SportEventCategory } from '@prisma/client';

export const cronTiming = '0 0 0 * * *';

export async function cronDefinition(discordClient: Client) {
  const date = new Date();

  const guilds = discordClient.guilds.cache.values();
  const [footballChannelId, nbaChannelId, motorsportChannelId] =
    await Promise.all([
      prisma.discordNotificationChannel.getFootballChannelId(),
      prisma.discordNotificationChannel.getNBAChannelId(),
      prisma.discordNotificationChannel.getMotorsportChannelId(),
    ]);
  const categoryChannelMapping: Record<
    SportEventCategory,
    { channelId: string; channel: null | TextChannel }
  > = {
    [SportEventCategory.FOOTBALL]: {
      channelId: footballChannelId,
      channel: null,
    },
    [SportEventCategory.BASKET]: { channelId: nbaChannelId, channel: null },
    [SportEventCategory.MOTORSPORT]: {
      channelId: motorsportChannelId,
      channel: null,
    },
  };

  for (const guild of guilds) {
    for (const categoryChannel of Object.values(categoryChannelMapping)) {
      categoryChannel.channel = await guild.channels
        .fetch(categoryChannel.channelId)
        .then((channel) => (channel.isTextBased() ? channel : null))
        .catch(() => null);
    }

    const events = await prisma.sportEvent.findMany({
      where: {
        startAt: {
          gte: date,
          lt: getEndOfDay(),
        },
      },
      select: {
        name: true,
        category: true,
        imageUrl: true,
        startAt: true,
        teamA: {
          select: {
            name: true,
            logoUrl: true,
            users: { select: { discordId: true } },
          },
        },
        teamB: {
          select: {
            name: true,
            logoUrl: true,
            users: { select: { discordId: true } },
          },
        },
        league: {
          select: {
            name: true,
            logoUrl: true,
            users: { select: { discordId: true } },
          },
        },
      },
      orderBy: {
        startAt: 'asc',
      },
    });

    try {
      for (const event of events) {
        const teamADiscordIds =
          event.teamA?.users.map(({ discordId }) => discordId) || [];
        const teamBDiscordIds =
          event.teamB?.users.map(({ discordId }) => discordId) || [];
        const leagueDiscordIds = event.league.users.map(
          ({ discordId }) => discordId
        );

        const totalToNotify =
          teamADiscordIds.length +
          teamBDiscordIds.length +
          leagueDiscordIds.length;

        if (totalToNotify === 0) {
          continue;
        }

        const spoiledMentions = spoiler(
          [
            ...teamADiscordIds.map(userMention),
            ...teamBDiscordIds.map(userMention),
            ...leagueDiscordIds.map(userMention),
          ].join(' ')
        );
        const isVs = event.teamA && event.teamB;
        const eventName =
          event.name ||
          (isVs && `${event.teamA.name} vs ${event.teamB.name}`) ||
          '-';

        const embed = new EmbedBuilder().setTitle(eventName);

        if (event.imageUrl) {
          embed.setThumbnail(event.imageUrl);
        }
        if (isVs) {
          embed.addFields(
            { name: 'Equipe 1', value: event.teamA.name, inline: true },
            { name: 'Equipe 2', value: event.teamB.name, inline: true }
          );
        }
        embed.addFields({
          name: "Début de l'evenement",
          value: new Intl.DateTimeFormat('fr-FR', {
            dateStyle: 'medium',
            timeStyle: 'medium',
          }).format(event.startAt),
        });

        categoryChannelMapping[event.category].channel?.send({
          content: spoiledMentions,
          embeds: [embed],
        });
      }
    } catch (e) {
      console.error('Cron error :');
      console.error(e);
    }
  }
}
