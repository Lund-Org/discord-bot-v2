module.exports = {
  apps: [
    {
      name: 'bot',
      script: './dist/bot/main.js',
    },
    // Not able to make it work, this will run differently
    // {
    //   name: 'lundprod',
    //   script: 'sh',
    //   args: './node_modules/.bin/dotenv -e .env -- ./node_modules/.bin/next start dist/lundprod/',
    // },
    {
      name: 'proxy',
      script: './dist/proxy/main.js',
    },
  ],
};
