import { CronJob } from 'cron';
import { Client } from 'discord.js';

import * as birthdayJob from './birthday.job';
import * as dailyShopJob from './daily-shop.job';

function setupCron(discordClient: Client) {
  const jobs = [
    new CronJob(
      birthdayJob.cronTiming,
      () => birthdayJob.cronDefinition(discordClient),
      null,
      true,
      'Europe/Paris'
    ),
    new CronJob(
      dailyShopJob.cronTiming,
      () => dailyShopJob.cronDefinition(discordClient),
      null,
      true,
      'Europe/Paris'
    ),
  ];

  jobs.forEach((job) => job.start());
}

export function initCron(discordClient: Client) {
  setupCron(discordClient);
}
