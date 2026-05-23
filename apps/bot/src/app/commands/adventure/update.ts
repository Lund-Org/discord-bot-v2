import { ChatInputCommandInteraction } from 'discord.js';

export const update = async (interaction: ChatInputCommandInteraction) => {
  const userId = interaction.user.id;

  const user = await prisma.user.findUniqueOrThrow({
    where: { discordId: userId },
    include: { adventurePlayer: true },
  });

  if (!user.adventurePlayer) {
    return interaction.reply(
      `Il faut d'abord rejoindre l'aventure avec la commande /adventure join`,
    );
  }

  const name = interaction.options.getString('name', true);

  await interaction.deferReply();

  await prisma.adventurePlayer.update({
    data: {
      name,
    },
    where: {
      id: user.adventurePlayer.userId,
    },
  });

  return interaction.editReply({
    content: `Nom mis à jour !`,
  });
};
