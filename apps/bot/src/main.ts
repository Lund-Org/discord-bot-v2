import { Client } from 'discord.js';
import { config as dotenvConfig } from 'dotenv';
import { startBot } from './app';
import { initCron } from './app/cron';

dotenvConfig();

startBot().then((discordClient) => {
  if (!process.argv.includes('--disableCron')) {
    initCron(discordClient as Client);
  }
  console.log('=> Ready !');
});
