import { AdventureSlot } from '@prisma/client';
import { ChatInputCommandInteraction } from 'discord.js';

import { computePlayerLife } from './utils';

export const unequip = async (interaction: ChatInputCommandInteraction) => {
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

  const slot = interaction.options.getString('slot', true) as AdventureSlot;

  await interaction.deferReply();

  const equipment = user.adventurePlayer.equipments.find(
    ({ slot: equipmentSlot }) => equipmentSlot === slot,
  );

  // Check if there is something on this slot
  if (!equipment) {
    return interaction.editReply({
      content: `Il n'y a pas d'équipement sur ce slot`,
    });
  }

  const previousMaxLife = computePlayerLife(user.adventurePlayer);
  const ratioPreviousLife = user.adventurePlayer.health / previousMaxLife;

  const newMaxLife = computePlayerLife({
    ...user.adventurePlayer,
    equipments: user.adventurePlayer.equipments.filter(
      ({ id }) => id !== equipment.id,
    ),
  });

  await prisma.$transaction([
    prisma.adventurePlayerEquipment.delete({
      where: {
        id: equipment.id,
      },
    }),
    prisma.adventurePlayer.update({
      where: { id: user.adventurePlayer.id },
      data: {
        health: Math.min(
          newMaxLife,
          Math.round(newMaxLife * ratioPreviousLife),
        ),
      },
    }),
  ]);

  return interaction.editReply({
    content: `Objet déséquipé avec succès\nPV max potentiellement mis à jour`,
  });
};
