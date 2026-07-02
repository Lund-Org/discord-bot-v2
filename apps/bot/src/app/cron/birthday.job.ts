import {
  giftPointsForBirthday,
  givenPointsForBirthday,
} from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import {
  Client,
  GuildBasedChannel,
  NonThreadGuildBasedChannel,
  TextChannel,
} from 'discord.js';

export const cronTiming = '0 0 0 * * *';

export async function cronDefinition(discordClient: Client) {
  const date = new Date();

  try {
    const BirthdayChannelId =
      await prisma.discordNotificationChannel.getBirthdayChannelId();

    // get the birthday entities
    const birthdays = await prisma.birthday.findMany({
      where: {
        birthdayDay: date.getDate(),
        birthdayMonth: date.getMonth() + 1,
      },
    });

    for (const birthday of birthdays) {
      const guilds = discordClient.guilds.cache;

      // find the member in the guilds
      for (const [_, guild] of guilds) {
        const target = await guild.members
          .fetch(birthday.discordId)
          .catch(() => null);

        if (target) {
          const notifChannel: GuildBasedChannel | null = await guild.channels
            .fetch(BirthdayChannelId)
            .catch(() => null);

          // get the general channel
          if (notifChannel && notifChannel.isTextBased()) {
            const hasEarnPoints = await giftPointsForBirthday(target.id);

            if (hasEarnPoints) {
              (notifChannel as TextChannel).send(
                `Bon anniversaire ${target.toString()} 🎂. En tant que joueur de gacha, tu as gagné ${givenPointsForBirthday} points :)`,
              );
            } else {
              (notifChannel as TextChannel).send(
                `Bon anniversaire ${target.toString()} 🎂`,
              );
            }
          }
        }
      }
    }
  } catch (e) {
    console.log('Cron error :');
    console.log(e);
  }
}
