import { rarityMapping } from '@discord-bot-v2/common';
import {
  AdventureEquipment,
  AdventureEquipmentType,
  AdventurePlayerEquipment,
  AdventureRarity,
  AdventureSlot,
} from '@prisma/client';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import {
  computePlayerLife,
  computePlayerShield,
  fistDefaultEquipment,
  getEquipmentData,
  getLevelXPRequirement,
} from './utils';

export const EQUIPMENT_PER_PAGE = 10;

function buildEquipmentSnippet(
  embed: EmbedBuilder,
  equipments: Array<
    AdventurePlayerEquipment & { equipment: AdventureEquipment }
  >,
) {
  const addEmbedField = (
    data: ReturnType<typeof getEquipmentData> & {
      name: string;
      rarity: AdventureRarity;
    },
  ) => {
    const { life, magicDmg, physicalDmg, shield, slot, name, rarity, type } =
      data;

    const value = [physicalDmg, magicDmg, life, shield, slot, type]
      .filter(Boolean)
      .join(' · ');

    embed.addFields([
      {
        name: `${name} [${rarityMapping[rarity]}]`,
        value,
      },
    ]);
  };

  let hasLeftWeapon = false;
  let hasRightWeapon = false;

  equipments.forEach((inventoryEquipment) => {
    const equipmentData = getEquipmentData(
      inventoryEquipment.equipment,
      inventoryEquipment.slot,
    );

    addEmbedField({
      ...equipmentData,
      name: inventoryEquipment.equipment.name,
      rarity: inventoryEquipment.equipment.rarity,
    });

    if (inventoryEquipment.slot === AdventureSlot.HAND_LEFT) {
      hasLeftWeapon = true;
      if (
        inventoryEquipment.equipment.slot === AdventureEquipmentType.DUAL_HAND
      ) {
        hasRightWeapon = true;
      }
    }
    if (inventoryEquipment.slot === AdventureSlot.HAND_RIGHT) {
      hasRightWeapon = true;
      if (
        inventoryEquipment.equipment.slot === AdventureEquipmentType.DUAL_HAND
      ) {
        hasLeftWeapon = true;
      }
    }
  });

  if (!hasLeftWeapon) {
    const fistData = getEquipmentData(
      {
        ...fistDefaultEquipment,
        slot: AdventureEquipmentType.HAND,
      },
      AdventureSlot.HAND_LEFT,
    );

    addEmbedField({
      ...fistData,
      name: fistDefaultEquipment.name,
      rarity: fistDefaultEquipment.rarity,
    });
  }

  if (!hasRightWeapon) {
    const fistData = getEquipmentData(
      {
        ...fistDefaultEquipment,
        slot: AdventureEquipmentType.HAND,
      },
      AdventureSlot.HAND_RIGHT,
    );

    addEmbedField({
      ...fistData,
      name: fistDefaultEquipment.name,
      rarity: fistDefaultEquipment.rarity,
    });
  }
}

export const status = async (interaction: ChatInputCommandInteraction) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { discordId: interaction.user.id, isActive: true },
    include: {
      adventurePlayer: {
        include: {
          equipments: {
            include: {
              equipment: true,
            },
            orderBy: {
              equipmentId: 'asc',
            },
          },
        },
      },
    },
  });

  if (!user?.adventurePlayer) {
    return interaction.reply(
      `Il faut d'abord rejoindre l'aventure avec la commande /adventure join`,
    );
  }

  await interaction.deferReply();

  const embed = new EmbedBuilder()
    .setColor('#0ee8da')
    .setTitle(`État de ${user.adventurePlayer.name}`);

  embed.addFields([
    {
      name: 'Niveau',
      value: `${user.adventurePlayer.level}`,
      inline: true,
    },
    {
      name: 'Or',
      value: `${user.adventurePlayer.gold}`,
      inline: true,
    },
    {
      name: 'Vie',
      value: `${user.adventurePlayer.health}/${computePlayerLife(user.adventurePlayer)} ❤️`,
      inline: true,
    },
    {
      name: 'Bouclier',
      value: `${computePlayerShield(user.adventurePlayer)} 🛡️`,
      inline: true,
    },
    {
      name: 'XP',
      value: `${user.adventurePlayer.experience}/${getLevelXPRequirement(user.adventurePlayer.level)}`,
      inline: true,
    },
    {
      name: 'Raids restants',
      value: `${user.adventurePlayer.raidLeft}`,
      inline: true,
    },
  ]);

  buildEquipmentSnippet(embed, user.adventurePlayer.equipments);
  await interaction.editReply({ embeds: [embed] });
};
