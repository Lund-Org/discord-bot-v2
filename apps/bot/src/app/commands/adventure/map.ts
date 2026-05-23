import { createCanvas } from 'canvas';
import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  TextChannel,
} from 'discord.js';

const CELL_SIZE = 40;

export const map = async (interaction: ChatInputCommandInteraction) => {
  const userId = interaction.user.id;

  const user = await prisma.user.findUniqueOrThrow({
    where: { discordId: userId },
    include: {
      adventurePlayer: {
        include: {
          raids: {
            include: {
              rooms: true,
            },
            where: {
              active: true,
            },
            take: 1,
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
    (interaction.channel as TextChannel).id !== raid.threadId
  ) {
    return interaction.reply(
      `Cette commande est à utiliser dans le thread du raid`,
    );
  }

  await interaction.deferReply();

  const { minX, maxX, minY, maxY } = raid.rooms.reduce(
    (acc, value) => {
      const newValues = { ...acc };

      newValues.minX = Math.min(value.x, acc.minX);
      newValues.minY = Math.min(value.y, acc.minY);
      newValues.maxX = Math.max(value.x, acc.maxX);
      newValues.maxY = Math.max(value.y, acc.maxY);

      return newValues;
    },
    {
      minX: raid.rooms[0].x,
      maxX: raid.rooms[0].x,
      minY: raid.rooms[0].y,
      maxY: raid.rooms[0].y,
    },
  );

  const width =
    Math.abs(minX) +
    Math.abs(maxX) +
    2 /*border*/ +
    (minX < 0 && maxX > 0 ? 1 : 0); /* include the 0 */
  const height =
    Math.abs(minY) +
    Math.abs(maxY) +
    2 /*border*/ +
    (minY < 0 && maxY > 0 ? 1 : 0); /* include the 0 */

  const canvas = createCanvas(width * CELL_SIZE, height * CELL_SIZE);
  const context = canvas.getContext('2d');

  // set background
  context.fillStyle = '#000000';
  context.fillRect(0, 0, width * CELL_SIZE, height * CELL_SIZE);

  const offsetX = 1 + Math.abs(minX);
  const offsetY = 1 + Math.abs(minY);

  raid.rooms.forEach(
    ({
      x,
      y,
      isEscape,
      enemyId,
      enemyLife,
      equipmentId,
      equipmentTaken,
      seen,
    }) => {
      const cellRectParams = {
        x: (offsetX + x) * CELL_SIZE + 1,
        y: (offsetY + y) * CELL_SIZE + 1,
        w: CELL_SIZE - 2,
        h: CELL_SIZE - 2,
      };

      if (!seen && Math.abs(x - raid.playerX + y - raid.playerY) > 1) {
        return;
      }

      if (isEscape) {
        context.fillStyle = '#94e984';
      } else if (enemyId && enemyLife > 0) {
        context.fillStyle = '#d23a35';
      } else if (equipmentId && !equipmentTaken) {
        context.fillStyle = '#4f92d9';
      } else {
        context.fillStyle = '#FFFFFF';
      }

      context.fillRect(
        cellRectParams.x,
        cellRectParams.y,
        cellRectParams.w,
        cellRectParams.h,
      );
    },
  );

  context.fillStyle = '#fae614';
  context.strokeStyle = '#000000';

  context.arc(
    (offsetX + raid.playerX) * CELL_SIZE + CELL_SIZE / 2,
    (offsetY + raid.playerY) * CELL_SIZE + CELL_SIZE / 2,
    CELL_SIZE / 3,
    0,
    2 * Math.PI,
  );

  context.fill();
  context.stroke();

  const attachment = new AttachmentBuilder(canvas.toBuffer(), {
    name: 'map.png',
  });
  interaction.editReply({
    files: [attachment],
    content:
      'Légende :\n🟡 Position actuelle\n🔴 Ennemis (vivants)\n🔵 Équipements\n🟢 Sortie',
  });
};
