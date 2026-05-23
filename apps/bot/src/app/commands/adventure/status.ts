import { rarityMapping } from '@discord-bot-v2/common';
import { AdventureEquipment, AdventurePlayerEquipment } from '@prisma/client';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import {
  computePlayerLife,
  computePlayerShield,
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
  if (!equipments.length) {
    embed.addFields([
      {
        name: 'Aucun objet équipé',
        value: '',
      },
    ]);
  }

  equipments.forEach((inventoryEquipment) => {
    const { life, magicDmg, physicalDmg, shield, slot } = getEquipmentData(
      inventoryEquipment.equipment,
    );

    const value = [physicalDmg, magicDmg, life, shield, slot]
      .filter(Boolean)
      .join(' · ');

    embed.addFields([
      {
        name: `#${inventoryEquipment.id} ${inventoryEquipment.equipment.name} [${rarityMapping[inventoryEquipment.equipment.rarity]}]`,
        value,
      },
    ]);
  });
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
    },
    {
      name: 'Or',
      value: `${user.adventurePlayer.gold}`,
    },
    {
      name: 'Vie',
      value: `${user.adventurePlayer.health}/${computePlayerLife(user.adventurePlayer)}❤️`,
    },
    {
      name: 'Bouclier',
      value: `${computePlayerShield(user.adventurePlayer)}🛡️`,
    },
    {
      name: 'XP',
      value: `${user.adventurePlayer.experience}/${getLevelXPRequirement(user.adventurePlayer.level)}`,
    },
    {
      name: 'Raids restants',
      value: `${user.adventurePlayer.raidLeft}`,
    },
  ]);

  buildEquipmentSnippet(embed, user.adventurePlayer.equipments);
  await interaction.editReply({ embeds: [embed] });
};
