import { prisma } from '@discord-bot-v2/prisma';
import { AttachmentBuilder,ChatInputCommandInteraction } from 'discord.js';

import { generateDrawImage } from '../../helpers/canvas';

export const view = async (interaction: ChatInputCommandInteraction) => {
  const cardToCreateId = interaction.options.getNumber('id', true);

  await interaction.deferReply();
  const cardToCreate = await prisma.cardType.findUnique({
    where: { id: cardToCreateId },
    include: {
      fusionDependencies: true,
    },
  });
  if (cardToCreate) {
    const canvas = await generateDrawImage(interaction.user.username, [
      { cardType: cardToCreate, isGold: false },
    ]);
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: 'cards.png',
    });

    return interaction.editReply({
      files: [attachment],
    });
  } else {
    return interaction.editReply("La carte n'existe pas");
  }
};
