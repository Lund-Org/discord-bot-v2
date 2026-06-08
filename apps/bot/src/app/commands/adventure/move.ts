import { AdventureEquipment } from '@prisma/client';
import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  TextChannel,
} from 'discord.js';
import { isEqual } from 'lodash';

import {
  getAdjacentRoomsDescription,
  getEquipmentData,
  RoomDirection,
} from './utils';

export const move = async (interaction: ChatInputCommandInteraction) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { discordId: interaction.user.id, isActive: true },
    include: {
      adventurePlayer: {
        include: {
          raids: {
            where: { active: true },
            take: 1,
            include: {
              rooms: {
                include: {
                  equipment: true,
                  enemy: true,
                },
              },
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

  if (!user.adventurePlayer.raids.length) {
    return interaction.reply(`Tu n'as aucun raid actif`);
  }

  const raid = user.adventurePlayer.raids[0];

  if (
    !(interaction.channel as TextChannel).isThread ||
    (interaction.channel as TextChannel).id !== raid.threadId
  ) {
    return interaction.reply(
      `Cette commande est à utiliser dans le thread du raid`,
    );
  }

  await interaction.deferReply();

  const currentRoom = raid.rooms.find(
    ({ x, y }) => raid.playerX === x && raid.playerY === y,
  );

  if (currentRoom.enemyId && currentRoom.enemyLife > 0) {
    return interaction.editReply(
      `Tu ne peux pas te déplacer en combat. Bat l'ennemi ou tente de t'échapper avec la commande escape`,
    );
  }

  const direction = interaction.options.getString(
    'direction',
    true,
  ) as RoomDirection;

  const target = {
    x:
      raid.playerX +
      (direction === 'LEFT' ? -1 : direction === 'RIGHT' ? 1 : 0),
    y: raid.playerY + (direction === 'DOWN' ? -1 : direction === 'UP' ? 1 : 0),
  };

  const targetRoom = raid.rooms.find(
    ({ x, y }) => target.x === x && target.y === y,
  );

  if (!targetRoom) {
    return interaction.editReply(`Tu ne peux pas te déplacer là, c'est un mur`);
  }

  const nextAdjacentRoomsCoordinates = [
    [targetRoom.x - 1, targetRoom.y],
    [targetRoom.x + 1, targetRoom.y],
    [targetRoom.x, targetRoom.y - 1],
    [targetRoom.x, targetRoom.y + 1],
  ];

  const nextAdjacentRooms = raid.rooms.filter(({ x, y }) =>
    nextAdjacentRoomsCoordinates.find((coordinate) =>
      isEqual(coordinate, [x, y]),
    ),
  );

  const takeItem = targetRoom.equipmentId && !targetRoom.equipmentTaken;

  // Transaction pour récupérer l'équipement s'il y en a un sur la targetRoom
  await prisma.$transaction([
    // Move on the room where there is an equipment
    ...(takeItem
      ? [
          prisma.adventurePlayerInventoryEquipment.upsert({
            where: {
              playerId_equipmentId: {
                equipmentId: targetRoom.equipmentId,
                playerId: user.adventurePlayer.id,
              },
            },
            create: {
              count: 1,
              equipmentId: targetRoom.equipmentId,
              playerId: user.adventurePlayer.id,
            },
            update: {
              count: { increment: 1 },
            },
          }),
          prisma.adventureRaidRoom.update({
            where: { id: targetRoom.id },
            data: {
              equipmentTaken: true,
            },
          }),
        ]
      : []),
    prisma.adventureRaid.update({
      where: { id: raid.id },
      data: {
        playerX: targetRoom.x,
        playerY: targetRoom.y,
      },
    }),
    prisma.adventureRaidRoom.update({
      where: { id: targetRoom.id },
      data: {
        seen: true,
      },
    }),
  ]);

  const description = getAdjacentRoomsDescription(
    targetRoom,
    nextAdjacentRooms,
  );

  const attachments: AttachmentBuilder[] =
    targetRoom.enemy && targetRoom.enemyLife > 0
      ? [new AttachmentBuilder(targetRoom.enemy.imageUrl)]
      : [];

  return interaction.editReply({
    content: `${takeItem ? `Tu ramasses un nouvel objet qui s'ajoute à ton inventaire.\n${displayEquipmentData(targetRoom.equipment)}\n` : ''}${description}`,
    files: attachments,
  });
};

function displayEquipmentData(equipment: AdventureEquipment) {
  const { life, magicDmg, physicalDmg, shield, slot, type } =
    getEquipmentData(equipment);

  return [physicalDmg, magicDmg, life, shield, slot, type]
    .filter(Boolean)
    .join(' · ');
}
