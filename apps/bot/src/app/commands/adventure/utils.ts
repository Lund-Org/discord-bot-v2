import {
  directionMapping,
  equipmentTypeMapping,
  slotMapping,
} from '@discord-bot-v2/common';
import {
  AdventureEnemy,
  AdventureEquipment,
  AdventureEquipmentType,
  AdventurePlayer,
  AdventurePlayerEquipment,
  AdventureRaidRoom,
  AdventureRarity,
  AdventureSlot,
} from '@prisma/client';
import { isEqual } from 'lodash';

export const BASE_HEALTH = 20;

export const ESCAPE_CHANCES = 0.25;

export const xpMultiplier = 3;

export type RoomDirection = keyof typeof directionMapping;

export function getEquipmentData(
  equipment: AdventureEquipment,
  equipmentSlot?: AdventureSlot,
) {
  const physicalDmg =
    equipment.physicalDamageHigherBound === 0
      ? ''
      : equipment.physicalDamageLowerBound ===
          equipment.physicalDamageHigherBound
        ? `${equipment.physicalDamageLowerBound} ⚔️`
        : `${equipment.physicalDamageLowerBound} - ${equipment.physicalDamageHigherBound} ⚔️`;

  const magicDmg =
    equipment.magicDamageHigherBound === 0
      ? ''
      : equipment.magicDamageLowerBound === equipment.magicDamageHigherBound
        ? `${equipment.magicDamageLowerBound} 🪄`
        : `${equipment.magicDamageLowerBound} - ${equipment.magicDamageHigherBound} 🪄`;

  const life = equipment.life ? `${equipment.life} ❤️` : '';

  const shield = equipment.shield ? `${equipment.shield} 🛡️` : '';

  const type = `Type : ${equipmentTypeMapping[equipment.slot]}`;
  const slot = equipmentSlot
    ? `Emplacement : ${slotMapping[equipmentSlot]}`
    : null;

  return { physicalDmg, magicDmg, life, shield, slot, type };
}

export function getAdjacentRoomsDescription(
  currentRoom: AdventureRaidRoom,
  adjacentRooms: Array<
    AdventureRaidRoom & {
      equipment?: AdventureEquipment;
      enemy?: AdventureEnemy;
    }
  >,
) {
  const sentences = adjacentRooms.reduce((acc, value) => {
    let direction = '⬆️';

    if (value.x === currentRoom.x + 1) {
      direction = '⬇️';
    } else if (value.y === currentRoom.y - 1) {
      direction = '⬅️';
    } else if (value.y === currentRoom.y + 1) {
      direction = '➡️';
    }

    const enemyStr =
      value.enemy && value.enemyLife > 0
        ? `Il y a un ennemi ${value.enemy.name}`
        : '';
    const equipmentStr =
      value.equipment && !value.equipmentTaken
        ? `Il y a un equipement (${value.equipment.name})`
        : '';
    const escapeStr = value.isEscape ? `C'est la sortie !` : '';

    const roomData = [direction, enemyStr, equipmentStr, escapeStr]
      .filter(Boolean)
      .join(' ');

    return [...acc, roomData];
  }, []);

  return sentences.join('\n');
}

export function getAdjacentRooms(
  currentRoom: AdventureRaidRoom,
  rooms: Array<
    AdventureRaidRoom & {
      equipment?: AdventureEquipment;
      enemy?: AdventureEnemy;
    }
  >,
) {
  const nextAdjacentRoomsCoordinates = [
    [currentRoom.x - 1, currentRoom.y],
    [currentRoom.x + 1, currentRoom.y],
    [currentRoom.x, currentRoom.y - 1],
    [currentRoom.x, currentRoom.y + 1],
  ];

  return rooms.filter(({ x, y }) =>
    nextAdjacentRoomsCoordinates.find((coordinate) =>
      isEqual(coordinate, [x, y]),
    ),
  );
}
export const fistDefaultEquipment = {
  consummable: false,
  createdAt: new Date(),
  id: 0,
  imageUrl: '',
  level: 1,
  life: 0,
  magicDamageHigherBound: 0,
  magicDamageLowerBound: 0,
  name: 'Poings',
  physicalDamageLowerBound: 2,
  physicalDamageHigherBound: 5,
  rarity: AdventureRarity.COMMON,
  shield: 0,
  slot: AdventureEquipmentType.HAND,
  updatedAt: new Date(),
} satisfies AdventureEquipment;

export function computePlayerLife(
  player: AdventurePlayer & {
    equipments: (AdventurePlayerEquipment & {
      equipment: AdventureEquipment;
    })[];
  },
) {
  return player.equipments.reduce((acc, { equipment }) => {
    return acc + equipment.life;
  }, BASE_HEALTH);
}

export function computePlayerShield(
  player: AdventurePlayer & {
    equipments: (AdventurePlayerEquipment & {
      equipment: AdventureEquipment;
    })[];
  },
) {
  return player.equipments.reduce((acc, { equipment }) => {
    return acc + equipment.shield;
  }, 0);
}

export function getDamageRange(lowerBound: number, higherBound: number) {
  return lowerBound + Math.random() * (higherBound - lowerBound);
}

export function calculateXP(enemy: AdventureEnemy, level: number) {
  return Math.round(
    ((enemy.lifeMultiplier +
      enemy.magicDamageMultiplierHigherBound +
      enemy.magicDamageMultiplierLowerBound +
      enemy.physicalDamageMultiplierHigherBound +
      enemy.physicalDamageMultiplierLowerBound +
      enemy.shieldMultiplier) /
      6) *
      level,
  );
}

export function getLevelXPRequirement(level: number) {
  // To change value, update only the last number. It multiplies a flat parabolic curve
  return ((level * level) / 10) * 1000;
}

export function enemyTurn(
  enemy: AdventureEnemy,
  enemyLevel: number,
  player: AdventurePlayer & {
    equipments: (AdventurePlayerEquipment & {
      equipment: AdventureEquipment;
    })[];
  },
  raidId: number,
) {
  const enemyPhysicalDamage = Math.round(
    getDamageRange(
      enemy.physicalDamageMultiplierLowerBound,
      enemy.physicalDamageMultiplierHigherBound,
    ) * enemyLevel,
  );
  const enemyMagicDamage = Math.round(
    getDamageRange(
      enemy.magicDamageMultiplierLowerBound,
      enemy.magicDamageMultiplierHigherBound,
    ) * enemyLevel,
  );

  const playerLife = player.health;
  const playerShield = computePlayerShield(player);

  const enemyDamage = Math.min(
    playerLife,
    Math.max(enemyPhysicalDamage - playerShield, 0) + enemyMagicDamage,
  );

  const isPlayerDead = playerLife - enemyDamage === 0;

  return {
    promises: [
      prisma.adventurePlayer.update({
        where: { id: player.id },
        data: {
          health: { decrement: enemyDamage },
          ...(isPlayerDead ? { gold: Math.max(player.gold * 0.9, 0) } : {}),
        },
      }),
      ...(isPlayerDead
        ? [
            prisma.adventureRaid.update({
              where: { id: raidId },
              data: { active: false },
            }),
          ]
        : []),
    ],
    isPlayerDead,
    enemyPhysicalDamage,
    enemyMagicDamage,
    playerShield,
    enemyDamage,
  };
}
