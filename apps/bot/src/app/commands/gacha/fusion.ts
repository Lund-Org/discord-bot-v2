import {
  ChatInputCommandInteraction,
  ActionRowBuilder,
  SelectMenuBuilder,
  APISelectMenuOption,
  SelectMenuInteraction,
  CacheType,
} from 'discord.js';
import { userNotFound } from './helper';
import { getCardsToFusion } from '@discord-bot-v2/common';
import { CardType, Player, PlayerInventory } from '@prisma/client';
import { prisma } from '@discord-bot-v2/prisma';

async function createFusionCard(
  player: Player & {
    playerInventory: (PlayerInventory & { cardType: CardType })[];
  },
  cardsRequired: (PlayerInventory & { cardType: CardType })[],
  fusionCard: CardType
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

export const fusion = async (interaction: SelectMenuInteraction<CacheType>) => {
  const player = (await userNotFound({
    interaction,
    relations: {
      playerInventory: {
        include: {
          cardType: true,
        },
      },
    },
  })) as Player & {
    playerInventory: (PlayerInventory & { cardType: CardType })[];
  };

  if (!player) {
    return;
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
      "La carte que tu veux créer n'est pas une carte fusion"
    );
  }

  const dependencyIds = cardToCreate.fusionDependencies.map((x) => x.id);
  const cardInventoriesRequired = player.playerInventory.filter((inventory) => {
    return (
      dependencyIds.includes(inventory.cardType.id) &&
      inventory.type === 'basic'
    );
  });
  const missingCards = dependencyIds.reduce(
    (acc: number[], val: number): number[] => {
      const hasInventoryCard = player.playerInventory.find(
        (x) => val == x.cardType.id && x.type === 'basic' && x.total > 0
      );

      return [...acc, ...(hasInventoryCard ? [] : [val])];
    },
    []
  );

  if (missingCards.length === 0) {
    await createFusionCard(player, cardInventoriesRequired, cardToCreate);
    return interaction.editReply('Carte fusion créée !');
  } else {
    return interaction.editReply(
      `Tu ne possèdes pas tous les réactifs nécessaires. Cartes manquantes : ${missingCards
        .map((id) => `#${id}`)
        .join(', ')}`
    );
  }
};

export async function fusionMenu(interaction: ChatInputCommandInteraction) {
  const player = await userNotFound({
    interaction,
  });

  if (!player) {
    return;
  }

  await interaction.deferReply({ ephemeral: true });
  const possibleFusions = await getCardsToFusion(player.discordId);

  if (!possibleFusions.length) {
    return interaction.editReply('Tu ne peux faire aucune fusion actuellement');
  }

  const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
    new SelectMenuBuilder()
      .setCustomId('fusion')
      .setPlaceholder('Selectionner')
      .addOptions(
        possibleFusions.map((fusionCard): APISelectMenuOption => {
          return {
            label: `#${fusionCard.id} - ${fusionCard.name}`,
            value: String(fusionCard.id),
          };
        })
      )
  );

  return interaction.editReply({
    content: 'Choisissez la carte fusion que vous voulez faire',
    components: [row],
  });
}
