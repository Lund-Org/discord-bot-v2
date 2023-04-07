import { Command } from 'commander';
import { config as dotenvConfig } from 'dotenv';

import { f1, f2, f3, fe, football, initLundprod, nba } from './app';

dotenvConfig();

const program = new Command();
const generators = [football, nba, f1, f2, f3, fe];
const keys = generators.map(({ key }) => key);

program
  .name('lundprod-cli')
  .description('CLI to automate some actions')
  .version('0.0.1');

program
  .command('generate-sport-events')
  .description('Generate sport events in database')
  .option(
    '--year <year>',
    'The year to retrieve',
    String(new Date().getFullYear())
  )
  .option('--fromFile', 'To import from json file', false)
  .option('--file <file>', 'The file path')
  .requiredOption('--sport <sport>', 'Sport to generate')
  .action((params) => {
    if (!keys.includes(params.sport)) {
      throw new Error(
        '`sport` option missing or not accepted. ' +
          `Accepted values : \`${keys.join('`, `')}\``
      );
    }

    const { generate } = generators.find(({ key }) => key === params.sport);

    if (!params.fromFile) {
      generate({ year: params.year });
    } else if (params.fromFile && params.file) {
      generate({ year: params.year, file: params.file });
    } else {
      console.error(
        'Invalid configuration, you set an import from file without filename'
      );
    }
  });

program
  .command('lundprod-init')
  .description('CLI for lundprod website init actions')
  .action(initLundprod);

program.parse();
