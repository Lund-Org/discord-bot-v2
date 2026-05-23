import {
  equipmentTypeMapping,
  equipmentTypeSlotMapping,
  isSlotCompatible,
  slotMapping,
} from '@discord-bot-v2/common';
import { AdventureEquipmentType, AdventureSlot } from '@prisma/client';
import { ChatInputCommandInteraction } from 'discord.js';

import { computePlayerLife } from './utils';

export const equip = async (interaction: ChatInputCommandInteraction) => {
  const userId = interaction.user.id;

  const user = await prisma.user.findUniqueOrThrow({
    where: { discordId: userId },
    include: {
      adventurePlayer: {
        include: {
          equipments: {
            include: {
              equipment: true,
            },
          },
        },
      },
    },
  });

  if (!user.adventurePlayer) {
    return interaction.reply(
      `Il faut d'abord rejoindre l'aventure avec la commande /adventure join`,
    );
  }

  const id = interaction.options.getNumber('id', true);
  const slot = interaction.options.getString('slot', true) as AdventureSlot;

  await interaction.deferReply();

  const [item, inventoryEquipment] = await Promise.all([
    prisma.adventureEquipment.findUnique({ where: { id } }),
    prisma.adventurePlayerInventoryEquipment.findUnique({
      include: { equipment: true },
      where: {
        playerId_equipmentId: {
          equipmentId: id,
          playerId: user.adventurePlayer.id,
        },
        count: { gt: 0 },
      },
    }),
  ]);

  // Check provided id is valid
  if (!item) {
    return interaction.editReply({
      content: `L'équipement avec cet identifiant n'existe pas`,
    });
  }

  // Check the item is in the inventory of the player
  if (!inventoryEquipment) {
    return interaction.editReply({
      content: `Tu ne possèdes pas l'équipement avec cet identifiant`,
    });
  }

  // Check the player has the required level
  if (item.level > user.adventurePlayer.level) {
    return interaction.editReply({
      content: `Tu n'as pas le niveau suffisant\nNiveau actuel : ${user.adventurePlayer.level}\nNiveau requis : ${item.level}`,
    });
  }

  // Check if the given slot is compatible
  if (!isSlotCompatible(item.slot, slot)) {
    return interaction.editReply({
      content: `Tu ne peux pas équiper cet objet sur ce slot\nEquipement de type **${equipmentTypeMapping[item.slot]}**\nEmplacement choisi **${slotMapping[slot]}**\nEmplacement(s) possible(s) **${equipmentTypeSlotMapping[item.slot].map((s) => slotMapping[s]).join(', ')}**`,
    });
  }

  // if user try to equip an hand but has already a dual hand equipment in hands
  // it's assigned to one of the two hands so we need to check
  // to know if we need to clean the equipment hands
  let shouldUnequipBothHands = item.slot === AdventureEquipmentType.DUAL_HAND;

  if (item.slot === AdventureEquipmentType.HAND) {
    const dualHandEquipmentEquipped =
      await prisma.adventurePlayerEquipment.findFirst({
        where: {
          slot: { in: [AdventureSlot.HAND_LEFT, AdventureSlot.HAND_RIGHT] },
          equipment: {
            slot: AdventureEquipmentType.DUAL_HAND,
          },
        },
      });

    if (dualHandEquipmentEquipped) {
      shouldUnequipBothHands = true;
    }
  }

  const previousMaxLife = computePlayerLife(user.adventurePlayer);
  const ratioPreviousLife = user.adventurePlayer.health / previousMaxLife;

  // Remove the previously assigned slot and create the new one
  await prisma.$transaction([
    prisma.adventurePlayerEquipment.deleteMany({
      where: {
        playerId: user.adventurePlayer.id,
        slot: {
          in: shouldUnequipBothHands
            ? [AdventureSlot.HAND_LEFT, AdventureSlot.HAND_RIGHT]
            : [slot],
        },
      },
    }),
    prisma.adventurePlayerEquipment.create({
      data: {
        slot,
        equipmentId: item.id,
        playerId: user.adventurePlayer.id,
      },
    }),
  ]);

  const updatedUser = await prisma.user.findUniqueOrThrow({
    where: { discordId: userId },
    include: {
      adventurePlayer: {
        include: {
          equipments: {
            include: {
              equipment: true,
            },
          },
        },
      },
    },
  });

  const newMaxLife = computePlayerLife(updatedUser.adventurePlayer);

  await prisma.adventurePlayer.update({
    where: { id: user.adventurePlayer.id },
    data: {
      health: Math.min(newMaxLife, Math.round(newMaxLife * ratioPreviousLife)),
    },
  });

  return interaction.editReply({
    content: `Objet équipé avec succès\nPV max potentiellement mis à jour`,
  });
};
