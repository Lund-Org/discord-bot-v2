import { addWebhooks, getWebhooks } from '@discord-bot-v2/igdb';

export async function initLundprod() {
  const webhooks = await getWebhooks();

  const hasWebhookForThisHost = webhooks.find(({ url }) =>
    url.startsWith(process.env.WEBSITE_URL)
  );

  if (!hasWebhookForThisHost) {
    console.log('Webhook not found for ' + process.env.WEBSITE_URL);
    await addWebhooks();
  } else {
    console.log('Webhook already exists for ' + process.env.WEBSITE_URL);
  }
}
