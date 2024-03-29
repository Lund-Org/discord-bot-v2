import { GachaConfigEnum } from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import { ButtonInteraction } from 'discord.js';

import { invalidateWebsitePages } from '../../helpers/discordEvent';
import {
  addCardsToInventory,
  checkEndGame,
  generateSummaryEmbed,
  getCardEarnSummary,
  userNotFoundWarning,
} from './helper';

function getDailyShop(playerId: number) {
  const today = new Date();

  return prisma.dailyShop.findUnique({
    where: {
      shopDay_shopMonth_shopYear: {
        shopDay: today.getDate(),
        shopMonth: today.getMonth(),
        shopYear: today.getFullYear(),
      },
    },
    include: {
      dailyShopItems: {
        orderBy: {
          id: 'asc',
        },
        include: {
          dailyPurchase: {
            where: {
              playerId: playerId,
            },
          },
          cardType: true,
        },
      },
    },
  });
}

function getCardId(customId: string) {
  const [_, id] = customId.match(/^shopbuy-(\d+)$/);

  return parseInt(id, 10);
}

function identifyMsg(interaction: ButtonInteraction, msg: string) {
  return `<@${interaction.user.id}>\n${msg}`;
}

export const shopBuy = async (interaction: ButtonInteraction) => {
  const user = await prisma.user.getPlayerWithInventory(interaction.user.id);

  if (!user?.player) {
    return userNotFoundWarning(interaction);
  }

  await interaction.deferReply();

  const id = getCardId(interaction.customId);
  const config = await prisma.config.findUnique({
    where: { name: GachaConfigEnum.SHOP_PRICES },
  });
  const shopPriceConfig = config?.value as { basic: number; gold: number };
  const dailyShop = await getDailyShop(user.player.id);

  if (!dailyShop) {
    return interaction.editReply(
      identifyMsg(interaction, 'Aucun shop disponible'),
    );
  }

  const availableShopItems = dailyShop.dailyShopItems
    .map((item) => {
      return item.dailyPurchase.length ? null : item;
    })
    .filter(Boolean);

  if (!availableShopItems.length) {
    return interaction.editReply(
      identifyMsg(
        interaction,
        'Tu as déjà acheté toutes les cartes du magasin',
      ),
    );
  }

  const selectedItem = availableShopItems.find(
    (shopItem) => shopItem.cardTypeId === id,
  );

  if (!selectedItem) {
    return interaction.editReply(
      identifyMsg(interaction, `La carte #${id} a déjà été acheté aujourd'hui`),
    );
  }

  const price =
    selectedItem.type === 'gold' ? shopPriceConfig.gold : shopPriceConfig.basic;

  if (!selectedItem) {
    return interaction.editReply(
      identifyMsg(interaction, 'Carte indisponible'),
    );
  }
  if (user.player.points < price) {
    return interaction.editReply(
      identifyMsg(interaction, "Tu n'as pas assez de points"),
    );
  }

  await Promise.all([
    addCardsToInventory(
      user,
      [
        {
          cardType: selectedItem.cardType,
          isGold: selectedItem.type === 'gold',
        },
      ],
      price,
    ),
    prisma.dailyPurchase.create({
      data: {
        playerId: user.player.id,
        dailyShopItemId: selectedItem.id,
      },
    }),
  ]);
  const embed = generateSummaryEmbed(
    getCardEarnSummary(user, [
      {
        cardType: selectedItem.cardType,
        isGold: selectedItem.type === 'gold',
      },
    ]),
  );
  invalidateWebsitePages(user.discordId);
  await checkEndGame(user.id);

  return interaction.editReply({
    content: identifyMsg(
      interaction,
      `Carte #${selectedItem.cardTypeId} achetée. Il te reste ${
        user.player.points - price
      } points`,
    ),
    embeds: [embed],
  });
};
