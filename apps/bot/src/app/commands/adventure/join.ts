import { ChatInputCommandInteraction } from 'discord.js';

import { BASE_HEALTH } from './utils';

export const join = async (interaction: ChatInputCommandInteraction) => {
  const userId = interaction.user.id;

  const user = await prisma.user.findUniqueOrThrow({
    where: { discordId: userId },
    include: { adventurePlayer: true },
  });

  if (user.adventurePlayer) {
    return interaction.reply(
      `Tu as déjà rejoint l'aventure avec ton personnage "${user.adventurePlayer.name}"`,
    );
  }

  const name = interaction.options.getString('name', true);

  await interaction.deferReply();

  // preset d'objets, random build

  await prisma.adventurePlayer.create({
    data: {
      name,
      userId: user.id,
      health: BASE_HEALTH,
    },
  });

  return interaction.editReply({
    content: `Bienvenue "${name}" dans l'aventure !`,
  });
};
