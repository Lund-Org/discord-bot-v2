import { prisma } from '@discord-bot-v2/prisma';
import { CardType } from '@prisma/client';
import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  Collection,
  Guild,
  TextChannel,
} from 'discord.js';

import { GachaConfigEnum } from '../enums/GachaEnum';
import { generateDrawImage } from '../helpers/canvas';

export const cronTiming = '0 0 0 * * *';

export async function cronDefinition(discordClient: Client) {
  const date = new Date();
  const shopChannel = await findShopChannel(discordClient);
  const config = await prisma.config.findUnique({
    where: { name: GachaConfigEnum.SHOP_PRICES },
  });

  if (!shopChannel) {
    console.error('The shop channel cannot be found');
    return;
  }
  if (!config) {
    console.error('The shop price config cannot be found');
    return;
  }

  try {
    const shopPriceConfig = config?.value as { basic: number; gold: number };

    await deleteThreadJMin2(shopChannel);
    await lockThreadJMin1(shopChannel);

    const cards = await prisma.$queryRaw<[CardType, CardType, CardType]>`
      SELECT *
      FROM CardType
      WHERE isFusion = 0
      ORDER BY RAND()
      LIMIT 3
    `;
    const threadName = getThreadName(date);
    const canvas = await generateDrawImage(
      threadName,
      cards.map((card, index) => ({ cardType: card, isGold: index === 0 }))
    );
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: 'cards.png',
    });

    const buttons = getButtons(cards);
    const thread = await shopChannel.threads.create({
      name: threadName,
    });
    const msg = await thread.send({
      content: `Nouveau daily shop :\nCarte normal = ${shopPriceConfig.basic} | Carte dorée = ${shopPriceConfig.gold}`,
      files: [attachment],
      components: [...buttons],
    });
    await msg.pin();
    await prisma.dailyShop.create({
      data: {
        shopDay: date.getDate(),
        shopMonth: date.getMonth(),
        shopYear: date.getFullYear(),
        threadId: thread.id,
        dailyShopItems: {
          createMany: {
            data: [
              {
                cardTypeId: cards[0].id,
                price: shopPriceConfig.gold,
                type: 'gold',
              },
              {
                cardTypeId: cards[1].id,
                price: shopPriceConfig.basic,
                type: 'basic',
              },
              {
                cardTypeId: cards[2].id,
                price: shopPriceConfig.basic,
                type: 'basic',
              },
            ],
          },
        },
      },
    });
  } catch (e) {
    console.log('Cron error :');
    console.log(e);
  }
}

async function findShopChannel(
  discordClient: Client
): Promise<TextChannel | null> {
  let shopChannel = null;
  const servers: Collection<string, Guild> = discordClient.guilds.cache;
  const ShopChannelId =
    await prisma.discordNotificationChannel.getShopChannelId();

  servers.some((server: Guild): boolean => {
    shopChannel = server.channels.cache.find((channel: TextChannel) => {
      return channel.id === ShopChannelId;
    });

    if (shopChannel) {
      return true;
    }

    return false;
  });

  return shopChannel;
}

function getThreadName(d: Date) {
  return (
    'Shop - ' +
    String(d.getDate()).padStart(2, '0') +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getFullYear())
  );
}

async function deleteThreadJMin2(shopChannel: TextChannel) {
  const previousDateJMin2 = new Date(
    new Date().getTime() - 24 * 60 * 60 * 1000 * 2
  );

  const previousDailyShopJMin2 = await prisma.dailyShop.findUnique({
    where: {
      shopDay_shopMonth_shopYear: {
        shopDay: previousDateJMin2.getDate(),
        shopMonth: previousDateJMin2.getMonth(),
        shopYear: previousDateJMin2.getFullYear(),
      },
    },
    include: { dailyShopItems: true },
  });

  if (previousDailyShopJMin2) {
    const { threads: channelThreads } = await shopChannel.threads.fetch();
    const previousThread = channelThreads.find(
      (x) => x.id === previousDailyShopJMin2.threadId
    );

    if (previousThread) {
      await previousThread.delete();
      await shopChannel.send(`${previousThread.name} fermé`);
    }
  }
}

async function lockThreadJMin1(shopChannel: TextChannel) {
  const previousDateJMin1 = new Date(
    new Date().getTime() - 24 * 60 * 60 * 1000
  );

  const previousDailyShopJMin1 = await prisma.dailyShop.findUnique({
    where: {
      shopDay_shopMonth_shopYear: {
        shopDay: previousDateJMin1.getDate(),
        shopMonth: previousDateJMin1.getMonth(),
        shopYear: previousDateJMin1.getFullYear(),
      },
    },
    include: { dailyShopItems: true },
  });

  if (previousDailyShopJMin1) {
    const { threads: channelThreads } = await shopChannel.threads.fetch();
    const previousThread = channelThreads.find(
      (x) => x.id === previousDailyShopJMin1.threadId
    );

    if (previousThread) {
      const messages = await previousThread.messages.fetchPinned();
      for (const message of messages.values()) {
        if (message.components.length) {
          await message.edit({ components: [] });
          break;
        }
      }

      await previousThread.send('Le magasin est maintenant fermé');
      await previousThread.setLocked(true);
    }
  }
}

function getButtons(cards: CardType[]) {
  return cards.map((card, index) => {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`shopbuy-${card.id}`)
        .setLabel(`Carte ${index + 1} : #${card.id}`)
        .setStyle(ButtonStyle.Primary)
    );
    return row;
  });
}
