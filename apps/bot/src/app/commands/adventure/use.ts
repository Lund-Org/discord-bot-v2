import {
  AdventureEquipment,
  AdventureEquipmentType,
  AdventurePlayerEquipment,
  AdventureSlot,
} from '@prisma/client';
import {
  ChatInputCommandInteraction,
  TextChannel,
  ThreadChannel,
} from 'discord.js';

import {
  calculateXP,
  computePlayerLife,
  enemyTurn,
  fistDefaultEquipment,
  getDamageRange,
  getLevelXPRequirement,
} from './utils';

export const use = async (interaction: ChatInputCommandInteraction) => {
  const userId = interaction.user.id;

  const user = await prisma.user.findUniqueOrThrow({
    where: { discordId: userId },
    include: {
      adventurePlayer: {
        include: {
          raids: {
            include: {
              rooms: {
                include: {
                  enemy: true,
                },
              },
            },
            where: {
              active: true,
            },
            take: 1,
          },
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

  if (!user.adventurePlayer.raids.length) {
    return interaction.reply(`Tu n'as aucun raid actif`);
  }

  const raid = user.adventurePlayer.raids[0];

  if (
    !(interaction.channel as TextChannel).isThread ||
    (interaction.channel as ThreadChannel).id !== raid.threadId
  ) {
    return interaction.reply(
      `Cette commande est à utiliser dans le thread du raid`,
    );
  }

  const currentRoom = raid.rooms.find(
    ({ x, y }) => raid.playerX === x && raid.playerY === y,
  );

  if (!currentRoom) {
    return interaction.reply(
      `[BUG] Salle actuelle non trouvée - contactez un admin`,
    );
  }

  await interaction.deferReply();

  const slot = interaction.options.getString('slot', true) as AdventureSlot;

  // Store interesting slot equipments
  const slots: Partial<
    Record<
      AdventureSlot,
      (AdventurePlayerEquipment & { equipment: AdventureEquipment }) | null
    >
  > = {
    [AdventureSlot.HAND_LEFT]: null,
    [AdventureSlot.HAND_RIGHT]: null,
    [AdventureSlot.CONSUMABLE_1]: null,
    [AdventureSlot.CONSUMABLE_2]: null,
  };

  user.adventurePlayer.equipments.forEach((playerEquipment) => {
    const { equipment, slot } = playerEquipment;

    if (!Object.keys(slots).includes(slot)) {
      return;
    }

    if (equipment.slot === AdventureEquipmentType.DUAL_HAND) {
      slots[AdventureSlot.HAND_LEFT] = playerEquipment;
      slots[AdventureSlot.HAND_RIGHT] = playerEquipment;
    } else {
      slots[slot] = playerEquipment;
    }
  });

  const noEnemy =
    !currentRoom.enemy || (currentRoom.enemy && currentRoom.enemyLife <= 0);

  // if use a weapon
  if (slot === AdventureSlot.HAND_LEFT || slot === AdventureSlot.HAND_RIGHT) {
    if (noEnemy) {
      return interaction.editReply(
        "Tu tapes... dans le vide car il n'y a pas d'ennemi",
      );
    }

    // calculate damages
    const weapon = slots[slot].equipment || fistDefaultEquipment;
    const physicalDamage = getDamageRange(
      weapon.physicalDamageLowerBound,
      weapon.physicalDamageHigherBound,
    );
    const magicDamage = getDamageRange(
      weapon.magicDamageLowerBound,
      weapon.magicDamageHigherBound,
    );

    const enemyLifeLost = Math.min(
      currentRoom.enemyLife,
      Math.max(
        physicalDamage -
          Math.round(
            currentRoom.enemy.shieldMultiplier * currentRoom.enemyLevel,
          ),
        0,
      ) + magicDamage,
    );

    // The enemy dies
    if (enemyLifeLost >= currentRoom.enemyLife) {
      const earnXP = calculateXP(currentRoom.enemy, currentRoom.enemyLevel);
      const levelUp =
        user.adventurePlayer.experience + earnXP >
        getLevelXPRequirement(user.adventurePlayer.level);

      await prisma.$transaction([
        prisma.adventureRaidRoom.update({
          where: { id: currentRoom.id },
          data: { enemyLife: 0 },
        }),
        levelUp
          ? prisma.adventurePlayer.update({
              where: { id: user.adventurePlayer.id },
              data: { level: { increment: 1 }, experience: 0 },
            })
          : prisma.adventurePlayer.update({
              where: { id: user.adventurePlayer.id },
              data: { experience: { increment: earnXP } },
            }),
      ]);

      return interaction.editReply(
        `Tu attaques l'ennemi avec ${enemyLifeLost} dégats (${physicalDamage} - ${Math.round(
          currentRoom.enemy.shieldMultiplier * currentRoom.enemyLevel,
        )} + ${magicDamage}) et il décède dans d'atroces souffrances.
        Tu as gagné ${earnXP} ${levelUp ? ', tu as level up !' : ''}`,
      );
    }

    // calculate enemy damages
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

    // const enemyPhysicalDamage = Math.round(
    //   getDamageRange(
    //     currentRoom.enemy.physicalDamageMultiplierLowerBound,
    //     currentRoom.enemy.physicalDamageMultiplierHigherBound,
    //   ) * currentRoom.enemyLevel,
    // );
    // const enemyMagicDamage = Math.round(
    //   getDamageRange(
    //     currentRoom.enemy.magicDamageMultiplierLowerBound,
    //     currentRoom.enemy.magicDamageMultiplierHigherBound,
    //   ) * currentRoom.enemyLevel,
    // );

    // const playerLife = user.adventurePlayer.health;
    // const playerShield = computePlayerShield(user.adventurePlayer);

    // const enemyDamage = Math.min(
    //   playerLife,
    //   Math.max(enemyPhysicalDamage - playerShield, 0) + enemyMagicDamage,
    // );

    // const isPlayerDead = playerLife - enemyDamage === 0;

    await prisma.$transaction([
      // prisma.adventurePlayer.update({
      //   where: { id: user.adventurePlayer.id },
      //   data: {
      //     health: { decrement: enemyDamage },
      //     ...(isPlayerDead
      //       ? { gold: Math.max(user.adventurePlayer.gold * 0.9, 0) }
      //       : {}),
      //   },
      // }),
      ...promises,
      prisma.adventureRaidRoom.update({
        where: { id: currentRoom.id },
        data: { enemyLife: { decrement: enemyLifeLost } },
      }),
      // ...(isPlayerDead
      //   ? [
      //       prisma.adventureRaid.update({
      //         where: { id: raid.id },
      //         data: { active: false },
      //       }),
      //     ]
      //   : []),
    ]);

    if (isPlayerDead) {
      await interaction.editReply(
        `Tu attaques l'ennemi avec ${enemyLifeLost} dégats (${physicalDamage} ⚔️ - ${Math.round(
          currentRoom.enemy.shieldMultiplier * currentRoom.enemyLevel,
        )} 🛡️ + ${magicDamage} 🪄) et il riposte avec ${enemyDamage} dégats (${enemyPhysicalDamage} ⚔️ - ${Math.min(playerShield, enemyPhysicalDamage)} 🛡️ + ${enemyMagicDamage} 🪄)
        Cette attaque a raison de toi, tu réussis néanmoins à fuir le donjon en y laissant quelques pièces sur la route.`,
      );
      return (interaction.channel as ThreadChannel).setLocked(true);
    } else {
      const lifeStatus =
        currentRoom.enemyLife - enemyLifeLost > 0
          ? `${user.adventurePlayer.name} : ${playerLife - enemyDamage} ❤️ - ${currentRoom.enemy.name} : ${currentRoom.enemyLife - enemyLifeLost}❤️`
          : `L'ennemi est vaincu. ${user.adventurePlayer.name} : ${playerLife - enemyDamage} ❤️`;

      return interaction.editReply(
        `Tu attaques l'ennemi avec ${enemyLifeLost} dégats (${physicalDamage} ⚔️ - ${Math.round(
          currentRoom.enemy.shieldMultiplier * currentRoom.enemyLevel,
        )} 🛡️ + ${magicDamage} 🪄) et il riposte avec ${enemyDamage} dégats (${enemyPhysicalDamage} ⚔️ - ${Math.min(playerShield, enemyPhysicalDamage)} 🛡️ + ${enemyMagicDamage} 🪄)
        ${lifeStatus}`,
      );
    }
  } else {
    // Use a consummable
    const playerEquipment = slots[slot];
    const { equipment: consummable } = playerEquipment;

    if (!consummable) {
      return interaction.editReply(
        `Tu n'as pas d'équipement sur cet emplacement`,
      );
    }

    // if a regen item
    if (consummable.life) {
      const newHealth = Math.min(
        user.adventurePlayer.health + consummable.life,
        computePlayerLife(user.adventurePlayer),
      );

      await prisma.$transaction([
        prisma.adventurePlayer.update({
          where: { id: user.adventurePlayer.id },
          data: {
            health: newHealth,
          },
        }),
        prisma.adventurePlayerInventoryEquipment.update({
          where: {
            playerId_equipmentId: {
              equipmentId: consummable.id,
              playerId: user.adventurePlayer.id,
            },
          },
          data: {
            count: { decrement: 1 },
          },
        }),
        prisma.adventurePlayerEquipment.delete({
          where: { id: consummable.id },
        }),
      ]);

      return interaction.editReply(
        `Tu as utilisé "${consummable.name}" et récupéré des points de vie. Tu as dorénavant ${newHealth} ❤️`,
      );
    }

    // if damage item & no enemy
    if (
      (consummable.physicalDamageLowerBound ||
        consummable.magicDamageLowerBound) &&
      noEnemy
    ) {
      return interaction.editReply(
        `Il n'y a pas d'ennemis, tu ne peux pas utiliser un objet offensif`,
      );
    }

    const itemPhysicalDamage = Math.round(
      getDamageRange(
        consummable.physicalDamageLowerBound,
        consummable.physicalDamageHigherBound,
      ),
    );
    const itemMagicDamage = Math.round(
      getDamageRange(
        consummable.magicDamageLowerBound,
        consummable.magicDamageHigherBound,
      ),
    );

    const enemyLifeLost = Math.min(
      currentRoom.enemyLife,
      Math.max(
        itemPhysicalDamage -
          Math.round(
            currentRoom.enemy.shieldMultiplier * currentRoom.enemyLevel,
          ),
        0,
      ) + itemMagicDamage,
    );

    await prisma.$transaction([
      prisma.adventureRaidRoom.update({
        where: { id: currentRoom.id },
        data: { enemyLife: { decrement: enemyLifeLost } },
      }),
      prisma.adventurePlayerInventoryEquipment.update({
        where: {
          playerId_equipmentId: {
            equipmentId: consummable.id,
            playerId: user.adventurePlayer.id,
          },
        },
        data: {
          count: { decrement: 1 },
        },
      }),
      prisma.adventurePlayerEquipment.delete({
        where: { id: consummable.id },
      }),
    ]);

    return interaction.editReply(
      `Tu attaques l'ennemi avec ${enemyLifeLost} dégats (${itemPhysicalDamage} - ${Math.round(
        currentRoom.enemy.shieldMultiplier * currentRoom.enemyLevel,
      )} + ${itemMagicDamage}) ${enemyLifeLost >= currentRoom.enemyLife ? "et il décède dans d'atroces souffrances" : ''}`,
    );
  }
};
