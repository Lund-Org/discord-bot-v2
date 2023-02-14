import { ChatInputCommandInteraction } from 'discord.js';
import { userNotFoundWarning } from './helper';
import { getGlobalRanking } from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';

export const profile = async (interaction: ChatInputCommandInteraction) => {
  const user = await prisma.user.getPlayer(interaction.user.id);

  if (!user?.player) {
    return userNotFoundWarning(interaction);
  }

  const [rank] = await getGlobalRanking([user.player.id]);

  return interaction.reply(
    `Tu es niveau ${rank.level.currentLevel} avec ${rank.currentXP}xp (tu es ${
      rank.position
    }${
      rank.position === 1 ? 'er' : 'eme'
    }). Le prochain niveau est obtenable avec ${
      rank.level.xpNextLevel
    }xp. Tu peux retrouver plus d'informations ici : https://lundprod.com/u/${
      interaction.user.id
    }`
  );
};
