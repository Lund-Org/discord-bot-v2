import { ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { shuffle } from 'lodash';

import { enemyTurn, ESCAPE_CHANCES, getAdjacentRooms } from './utils';

export const escape = async (interaction: ChatInputCommandInteraction) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { discordId: interaction.user.id, isActive: true },
    include: {
      adventurePlayer: {
        include: {
          equipments: {
            include: {
              equipment: true,
            },
          },
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

  if (!currentRoom.enemyId || currentRoom.enemyLife <= 0) {
    return interaction.editReply(`Il n'y a rien à fuir`);
  }

  const adjacentRooms = getAdjacentRooms(currentRoom, raid.rooms);

  const canEscape = Math.random() < ESCAPE_CHANCES;

  if (canEscape) {
    const escapeRoom = shuffle(adjacentRooms)[0];

    await prisma.adventureRaid.update({
      where: { id: raid.id },
      data: {
        playerX: escapeRoom[0].x,
        playerY: escapeRoom[0].y,
      },
    });
  } else {
    // enemy turn
    const {
      enemyDamage,
      enemyMagicDamage,
      enemyPhysicalDamage,
      isPlayerDead,
      playerShield,
      promises,
    } = enemyTurn(
      currentRoom.enemy,
      currentRoom.enemyLevel,
      user.adventurePlayer,
      raid.id,
    );
    const playerLife = user.adventurePlayer.health;

    await prisma.$transaction(promises);

    return interaction.editReply(
      [
        "Tu n'as pas réussi à t'échapper",
        `L'ennemi t'attaque avec ${enemyDamage} dégats (${enemyPhysicalDamage}🗡️ - ${Math.min(playerShield, enemyPhysicalDamage)}🛡️ + ${enemyMagicDamage}🪄)`,
        ...(isPlayerDead
          ? [
              `Cette attaque a raison de toi, tu réussis néanmoins à fuir le donjon en y laissant quelques pièces sur la route.`,
            ]
          : [
              `${user.adventurePlayer.name} : ${playerLife - enemyDamage}❤️ - ${currentRoom.enemy.name} : ${currentRoom.enemyLife}❤️`,
            ]),
      ].join('\n'),
    );
  }
};
