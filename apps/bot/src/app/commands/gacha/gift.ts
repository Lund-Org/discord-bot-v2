import { addPoints } from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import { Gift, Player, PlayerInventory } from '@prisma/client';
import { ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js';
import { generateDrawImage } from '../../helpers/canvas';
import { addCardsToInventory, drawCards, userNotFound } from './helper';

type GiftSchema = { points: number } | { card: number } | { gold: number };

function isPointsBonus(giftValue: GiftSchema): giftValue is { points: number } {
  return 'points' in giftValue;
}
function isCardBonus(giftValue: GiftSchema): giftValue is { card: number } {
  return 'card' in giftValue;
}
function isGoldBonus(giftValue: GiftSchema): giftValue is { gold: number } {
  return 'gold' in giftValue;
}

function processGift(gift: Gift) {
  let message = 'Tu as récupéré ton cadeau. Il contient :\n';
  const actions = {
    points: 0,
    basicCard: 0,
    goldCard: 0,
  };

  (gift.bonus as GiftSchema[]).forEach((bonus) => {
    if (isPointsBonus(bonus)) {
      actions.points = bonus.points;
      message += `• ${bonus.points} points\n`;
    } else if (isCardBonus(bonus)) {
      actions.basicCard = bonus.card;
      message += `• ${bonus.card} carte(s)\n`;
    } else if (isGoldBonus(bonus)) {
      actions.goldCard = bonus.gold;
      message += `• ${bonus.gold} carte(s) dorée(s)\n`;
    }
  });

  return { message, actions };
}

async function saveNewGift(gift: Gift, player: Player) {
  return prisma.gift.update({
    where: { id: gift.id },
    data: {
      players: {
        connect: {
          id: player.id,
        },
      },
    },
  });
}

/** Method for the config keyword */
async function getPointsToAdd(points: number | undefined) {
  return Promise.resolve(points || 0);
}
async function getBasicCards(numberOfCards: number | undefined) {
  return numberOfCards ? drawCards(numberOfCards) : Promise.resolve([]);
}
async function getGoldCards(numberOfCards: number | undefined) {
  return numberOfCards
    ? drawCards(numberOfCards).then((cards) => {
        return cards.map((card) => ({ ...card, isGold: true }));
      })
    : Promise.resolve([]);
}

/** Command */
export const gift = async (interaction: ChatInputCommandInteraction) => {
  const code = interaction.options.getString('code', true);
  const player = (await userNotFound({
    interaction,
    relations: {
      gifts: true,
      playerInventory: {
        include: {
          cardType: true,
        },
      },
    },
  })) as Player & { playerInventory: PlayerInventory[] };

  if (!player) {
    return;
  }

  await interaction.deferReply();
  const foundGift = await prisma.gift.findFirst({
    where: {
      code,
      beginningDatetime: {
        lt: new Date(),
      },
      endDatetime: {
        gt: new Date(),
      },
    },
  });

  if (!foundGift) {
    return interaction.editReply(
      "Le cadeau n'existe pas ou tu n'es pas dans sa période de validité"
    );
  }

  const hasGift = await prisma.gift.findFirst({
    where: {
      id: foundGift.id,
      players: {
        some: {
          id: player.id,
        },
      },
    },
  });

  if (hasGift) {
    return interaction.editReply('Le cadeau a déjà été récupéré');
  }

  const { message, actions } = processGift(foundGift);
  const [pointsToAdd, basicCards, goldCards] = await Promise.all([
    getPointsToAdd(actions.points),
    getBasicCards(actions.basicCard),
    getGoldCards(actions.goldCard),
  ]);
  const unionCards = [...basicCards, ...goldCards];
  let attachment;

  if (unionCards.length) {
    const canvas = await generateDrawImage(
      interaction.user.username,
      unionCards
    );
    attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: 'cards.png',
    });
  }

  await Promise.all([
    addPoints(player.id, pointsToAdd),
    saveNewGift(foundGift, player),
    addCardsToInventory(player, unionCards, 0),
  ]);
  return attachment
    ? interaction.editReply({
        content: message,
        files: [attachment],
      })
    : interaction.editReply(message);
};
