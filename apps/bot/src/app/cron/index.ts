import { prisma } from '@discord-bot-v2/prisma';
import { CronJob } from 'cron';
import { Client, NonThreadGuildBasedChannel, TextChannel } from 'discord.js';
import {
  giftPointsForBirthday,
  givenPointsForBirthday,
} from '@discord-bot-v2/common';

function setupBirthdayCron(discordClient: Client) {
  const job = new CronJob(
    '0 0 0 * * *',
    async () => {
      const date = new Date();

      try {
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
              const notifChannel: NonThreadGuildBasedChannel | null =
                await guild.channels
                  .fetch(process.env.BIRTHDAY_CHANNEL_ID || '')
                  .catch(() => null);

              // get the general channel
              if (notifChannel && notifChannel.isTextBased()) {
                const hasEarnPoints = await giftPointsForBirthday(target.id);

                if (hasEarnPoints) {
                  (notifChannel as TextChannel).send(
                    `Bon anniversaire ${target.toString()} 🎂. En tant que joueur de gacha, tu as gagné ${givenPointsForBirthday} points :)`
                  );
                } else {
                  (notifChannel as TextChannel).send(
                    `Bon anniversaire ${target.toString()} 🎂`
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
    },
    null,
    true,
    'Europe/Paris'
  );

  job.start();
}

export function initCron(discordClient: Client) {
  setupBirthdayCron(discordClient);
}
