import { ChatInputCommandInteraction } from 'discord.js';
import { userNotFound } from './helper';
import { getGlobalRanking } from '@discord-bot-v2/common';

export const profile = async (interaction: ChatInputCommandInteraction) => {
  const player = await userNotFound({
    interaction,
  });

  if (!player) {
    return;
  }

  const [rank] = await getGlobalRanking([player.id]);

  return interaction.reply(
    `Tu es niveau ${rank.level.currentLevel} avec ${rank.currentXP}xp (tu es ${
      rank.position
    }${
      rank.position === 1 ? 'er' : 'eme'
    }). Le prochain niveau est obtenable avec ${
      rank.level.xpNextLevel
    }xp. Tu peux retrouver plus d'informations ici : https://lundprod.com/gacha/ranking/${
      interaction.user.id
    }`
  );
};
