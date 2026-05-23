import { Dungeon, generateName } from '@discord-bot-v2/common';
import {
  AdventureEnemy,
  AdventureEquipment,
  AdventureRarity,
} from '@prisma/client';
import { ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { differenceBy, isEqual, shuffle } from 'lodash';

import {
  computePlayerLife,
  getAdjacentRooms,
  getAdjacentRoomsDescription,
} from './utils';

export const raid = async (interaction: ChatInputCommandInteraction) => {
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

  await interaction.deferReply();

  const level = interaction.options.getNumber('level', true);
  const size = interaction.options.getString('size', true) as
    | 'sm'
    | 'md'
    | 'xl';

  const hasActiveRaid = !!(await prisma.adventureRaid.findFirst({
    where: {
      playerId: user.adventurePlayer.id,
      active: true,
    },
  }));

  if (hasActiveRaid) {
    return interaction.editReply({
      content: `Tu possèdes déjà un raid actif`,
    });
  }

  if (user.adventurePlayer.raidLeft <= 0) {
    return interaction.editReply({
      content: `Tu n'as plus de raids disponibles`,
    });
  }

  const raidCounter = await prisma.adventureRaid.count({
    where: {
      playerId: user.adventurePlayer.id,
    },
  });

  const dungeon = new Dungeon({
    size: size === 'sm' ? [20, 20] : size === 'md' ? [30, 30] : [40, 40],
    rooms: {
      initial: {
        min_size: [1, 1],
        max_size: [3, 3],
        max_exits: 1,
      },
      any: {
        min_size: [2, 2],
        max_size: [5, 5],
        max_exits: 4,
      },
    },
    max_corridor_length: 6,
    min_corridor_length: 2,
    corridor_density: 0.5,
    symmetric_rooms: false,
    interconnects: 1,
    max_interconnect_length: 10,
    room_count: size === 'sm' ? 7 : size === 'md' ? 10 : 15,
  });

  const raidName = generateName();

  const enemyCount = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
  const equipmentCount = size === 'sm' ? 2 : size === 'md' ? 4 : 6;

  const totalEnemy = await prisma.adventureEnemy.count();
  const { level: maxItemLevel } =
    await prisma.adventureEquipment.findFirstOrThrow({
      orderBy: { level: 'desc' },
    });

  const enemies: AdventureEnemy[] = [];
  const items: AdventureEquipment[] = [];

  // generate the enemies of the raid
  for (let i = 0; i < enemyCount; ++i) {
    const enemy = await prisma.adventureEnemy.findFirst({
      skip: Math.floor(Math.random() * totalEnemy),
    });

    enemies.push(enemy);
  }

  // generate the loot
  for (let i = 0; i < equipmentCount; ++i) {
    // calculate the level of the item
    const itemLevel =
      user.adventurePlayer.level - level > 2
        ? level
        : Math.random() < 0.5
          ? Math.min(user.adventurePlayer.level, maxItemLevel)
          : Math.min(level, maxItemLevel);

    // calculate the rarity of the item
    const rarityRand = Math.random() * 100;

    let rarity: AdventureRarity | null =
      rarityRand < 45
        ? AdventureRarity.COMMON
        : rarityRand < 70
          ? AdventureRarity.UNCOMMON
          : rarityRand < 85
            ? AdventureRarity.RARE
            : rarityRand < 92
              ? AdventureRarity.EPIC
              : rarityRand < 97
                ? AdventureRarity.LEGENDARY
                : AdventureRarity.MYTHIC;

    let item: AdventureEquipment | null = null;

    // get the item of fallback on a less rare one if not found
    do {
      const totalItems = await prisma.adventureEquipment.count({
        where: { level: itemLevel, rarity },
      });

      item = await prisma.adventureEquipment.findFirst({
        where: { level: itemLevel, rarity },
        skip: Math.floor(Math.random() * totalItems),
      });

      if (!item) {
        rarity = getClosestRarity(rarity);
      }
    } while (!item && rarity);

    items.push(item);
  }

  const rooms: Array<{
    coordinates: [x: number, y: number];
    enemy: AdventureEnemy | null;
    item: AdventureEquipment | null;
  }> = [];

  // iterate on the map to create the rooms we will create
  for (let y = 0; y < dungeon.size[1]; y++) {
    for (let x = 0; x < dungeon.size[0]; x++) {
      if (
        dungeon.start_pos &&
        dungeon.start_pos[0] === x &&
        dungeon.start_pos[1] === y
      ) {
        // do nothing, it's the spawn
      } else if (!dungeon.walls.get([x, y])) {
        rooms.push({ coordinates: [x, y], enemy: null, item: null });
      }
    }
  }

  // define the min distance where the items/enemies are
  const distance = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const startPosition = dungeon.start_pos || rooms[0].coordinates;
  let awayRooms = rooms.filter(
    ({ coordinates: [x, y] }) =>
      Math.abs(x + y - (startPosition[0] + startPosition[1])) > distance,
  );

  // security not enough rooms "far" from the spawn
  if (awayRooms.length < items.length + enemies.length) {
    awayRooms = rooms.filter(
      ({ coordinates: [x, y] }) =>
        x !== startPosition[0] && y !== startPosition[1],
    );
  }

  const otherRooms = differenceBy(awayRooms, rooms, 'coordinates');
  const shuffledAwayRooms = shuffle(awayRooms);
  const itemRooms: typeof rooms = [];
  const enemyRooms: typeof rooms = [];

  items.forEach((item) => {
    const room = shuffledAwayRooms.pop();
    room.item = item;
    itemRooms.push(room);
  });
  enemies.forEach((enemy) => {
    const room = shuffledAwayRooms.pop();
    room.enemy = enemy;
    enemyRooms.push(room);
  });

  const escape = shuffledAwayRooms.pop();

  const thread = await (interaction.channel as TextChannel).threads.create({
    name: `${user.adventurePlayer.name} - Raid #${raidCounter + 1}`,
    invitable: false,
    startMessage: `Bienvenue dans le raid "${raidName}"`,
  });
  await thread.members.add(userId);

  try {
    const [raid] = await prisma.$transaction([
      prisma.adventureRaid.create({
        include: {
          rooms: {
            include: {
              enemy: true,
              equipment: true,
            },
          },
        },
        data: {
          active: true,
          playerX: startPosition[0],
          playerY: startPosition[1],
          threadId: thread.id,
          name: raidName,
          player: { connect: { id: user.adventurePlayer.id } },
          rooms: {
            createMany: {
              data: [
                ...otherRooms.map(({ coordinates }) => ({
                  x: coordinates[0],
                  y: coordinates[1],
                  isEscape: false,
                  seen: isEqual(coordinates, startPosition),
                })),
                ...itemRooms.map(({ coordinates, item }) => ({
                  x: coordinates[0],
                  y: coordinates[1],
                  isEscape: false,
                  equipmentId: item.id,
                })),
                ...enemyRooms.map(({ coordinates, enemy }) => ({
                  x: coordinates[0],
                  y: coordinates[1],
                  isEscape: false,
                  enemyId: enemy.id,
                  enemyLevel: level,
                  enemyLife: Math.ceil(enemy.lifeMultiplier * level),
                })),
                {
                  x: escape.coordinates[0],
                  y: escape.coordinates[1],
                  isEscape: true,
                },
              ],
            },
          },
        },
      }),
      prisma.adventurePlayer.update({
        data: {
          raidLeft: { decrement: 1 },
          health: computePlayerLife(user.adventurePlayer),
        },
        where: {
          id: user.adventurePlayer.id,
        },
      }),
    ]);

    const spawn = raid.rooms.find(({ x, y }) => isEqual(startPosition, [x, y]));

    const adjacentRooms = getAdjacentRooms(spawn, raid.rooms);

    await thread.send(getAdjacentRoomsDescription(spawn, adjacentRooms));

    return interaction.editReply({
      content: `Raid créé, bonne chance aventurier`,
    });
  } catch (err) {
    await thread.send(
      `Une erreur s'est produite lors de la génération du raid\n||${err.name}||`,
    );
  }
};

function getClosestRarity(rarity: AdventureRarity): AdventureRarity | null {
  const list = [
    AdventureRarity.COMMON,
    AdventureRarity.UNCOMMON,
    AdventureRarity.RARE,
    AdventureRarity.EPIC,
    AdventureRarity.LEGENDARY,
    AdventureRarity.MYTHIC,
  ];

  const currentIndex = list.findIndex((r) => r === rarity);

  if (currentIndex <= 0) {
    return null;
  } else {
    return list[currentIndex - 1];
  }
}
