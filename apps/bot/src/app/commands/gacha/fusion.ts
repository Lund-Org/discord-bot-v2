import { getCardsToFusion } from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import { CardType, Player, PlayerInventory } from '@prisma/client';
import {
  ActionRowBuilder,
  APISelectMenuOption,
  CacheType,
  ChatInputCommandInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';

import { invalidateWebsitePages } from '../../helpers/discordEvent';
import {
  checkEndGame,
  generateSummaryEmbed,
  getCardEarnSummary,
  getCardLostSummary,
  userNotFoundWarning,
} from './helper';

async function createFusionCard(
  player: Player & {
    playerInventory: (PlayerInventory & { cardType: CardType })[];
  },
  cardsRequired: (PlayerInventory & { cardType: CardType })[],
  fusionCard: CardType,
) {
  await Promise.all([
    prisma.playerInventory.updateMany({
      where: {
        type: 'basic',
        playerId: player.id,
        id: { in: cardsRequired.map(({ id }) => id) },
      },
      data: {
        total: { decrement: 1 },
      },
    }),
    prisma.playerInventory.upsert({
      where: {
        playerId_cardTypeId_type: {
          type: 'basic',
          cardTypeId: fusionCard.id,
          playerId: player.id,
        },
      },
      update: { total: { increment: 1 } },
      create: {
        total: 1,
        type: 'basic',
        player: {
          connect: {
            id: player.id,
          },
        },
        cardType: {
          connect: {
            id: fusionCard.id,
          },
        },
      },
    }),
  ]);
}

export const fusion = async (
  interaction: StringSelectMenuInteraction<CacheType>,
) => {
  const user = await prisma.user.getPlayerWithInventory(interaction.user.id);

  if (!user?.player) {
    return userNotFoundWarning(interaction);
  }

  await interaction.deferReply();
  const cardToCreateId = parseInt(interaction.values[0], 10);
  const cardToCreate = await prisma.cardType.findUnique({
    where: { id: cardToCreateId },
    include: {
      fusionDependencies: true,
    },
  });

  if (!cardToCreate) {
    return interaction.editReply("La carte n'existe pas");
  }
  if (!cardToCreate.isFusion) {
    return interaction.editReply(
      "La carte que tu veux créer n'est pas une carte fusion",
    );
  }

  const dependencyIds = cardToCreate.fusionDependencies.map((x) => x.id);
  const cardInventoriesRequired = user.player.playerInventory.filter(
    (inventory) => {
      return (
        dependencyIds.includes(inventory.cardType.id) &&
        inventory.type === 'basic'
      );
    },
  );
  const missingCards = dependencyIds.reduce(
    (acc: number[], val: number): number[] => {
      const hasInventoryCard = user.player.playerInventory.find(
        (x) => val == x.cardType.id && x.type === 'basic' && x.total > 0,
      );

      return [...acc, ...(hasInventoryCard ? [] : [val])];
    },
    [],
  );

  if (missingCards.length === 0) {
    const embed = generateSummaryEmbed([
      ...getCardLostSummary(
        user,
        cardInventoriesRequired.map((x) => ({
          cardType: x.cardType,
          isGold: false,
        })),
      ),
      ...getCardEarnSummary(user, [{ cardType: cardToCreate, isGold: false }]),
    ]);
    await createFusionCard(user.player, cardInventoriesRequired, cardToCreate);
    invalidateWebsitePages(user.discordId);
    await checkEndGame(user.id);
    return interaction.editReply({
      content: `Carte fusion #${cardToCreate.id} créée !`,
      embeds: [embed],
    });
  } else {
    return interaction.editReply(
      `Tu ne possèdes pas tous les réactifs nécessaires. Cartes manquantes : ${missingCards
        .map((id) => `#${id}`)
        .join(', ')}`,
    );
  }
};

export async function fusionMenu(interaction: ChatInputCommandInteraction) {
  const user = await prisma.user.getPlayer(interaction.user.id);

  if (!user?.player) {
    return userNotFoundWarning(interaction);
  }

  await interaction.deferReply({ ephemeral: true });
  const possibleFusions = await getCardsToFusion(user.discordId);

  if (!possibleFusions.length) {
    return interaction.editReply('Tu ne peux faire aucune fusion actuellement');
  }

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('fusion')
      .setPlaceholder('Selectionner')
      .addOptions(
        possibleFusions.map((fusionCard): APISelectMenuOption => {
          return {
            label: `#${fusionCard.id} - ${fusionCard.name}`,
            value: String(fusionCard.id),
          };
        }),
      ),
  );

  return interaction.editReply({
    content: 'Choisissez la carte fusion que vous voulez faire',
    components: [row],
  });
}
