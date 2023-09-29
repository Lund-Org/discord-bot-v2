import { CronJob } from 'cron';
import { Client } from 'discord.js';

import * as birthdayJob from './birthday.job';
import * as dailyShopJob from './daily-shop.job';
import * as gameReleaseJob from './game-release.job';
import * as sportJob from './sport-notifications.job';
import * as sportSyncJob from './sport-sync.job';
import * as syncReleaseDateJob from './sync-release-date.job';

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
    new CronJob(
      sportJob.cronTiming,
      () => sportJob.cronDefinition(discordClient),
      null,
      true,
      'Europe/Paris'
    ),
    new CronJob(
      gameReleaseJob.cronTiming,
      () => gameReleaseJob.cronDefinition(),
      null,
      true,
      'Europe/Paris'
    ),
    new CronJob(
      sportSyncJob.cronTiming,
      () => sportSyncJob.cronDefinition(),
      null,
      true,
      'Europe/Paris'
    ),
    new CronJob(
      syncReleaseDateJob.cronTiming,
      () => syncReleaseDateJob.cronDefinition(),
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
