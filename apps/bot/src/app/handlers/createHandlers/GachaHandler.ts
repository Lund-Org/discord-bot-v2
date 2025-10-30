import { prisma } from '@discord-bot-v2/prisma';
import { Client, Message } from 'discord.js';

import { invalidateWebsitePages } from '../../helpers/discordEvent';
import { Handler } from '../Handler';

class GachaHandler extends Handler {
  async validate(client: Client, msg: Message): Promise<boolean> {
    return super.validate(client, msg);
  }

  async process(client: Client, msg: Message): Promise<boolean> {
    await addPoints({ msg });
    // important to keep false so the other handler will be process too
    return false;
  }
}

export const addPoints = async ({ msg }: { msg: Message }): Promise<void> => {
  const user = await prisma.user.getPlayer(msg.author.id);

  if (!user?.player) {
    return;
  }

  const delay = 60 * 1000; // one minute
  const warnDelay = 6 * 3600 * 1000; // 6 hours

  // if last message is in less than 1 minute
  // AND less than 15 000 points
  if (
    Date.now() - new Date(user.player.lastMessageDate).getTime() > delay &&
    user.player.points < 15000
  ) {
    await prisma.player.update({
      where: { id: user.player.id },
      data: {
        points: { increment: 50 },
        lastMessageDate: new Date(),
      },
    });
    invalidateWebsitePages(msg.author.id);

    // if the player has more than 13000
    // AND want to be warned
    // AND last warn was more than 6h
    if (
      user.player.points >= 13000 &&
      user.player.wantToBeWarn &&
      (!user.player.lastPointsReminder ||
        Date.now() - new Date(user.player.lastPointsReminder).getTime() >
          warnDelay)
    ) {
      await Promise.all([
        prisma.player.update({
          where: { id: user.player.id },
          data: {
            lastPointsReminder: new Date(),
          },
        }),
        msg.reply(
          "⚠ Attention : Tu dépasses les 13k points, n'oublie pas que la limite est de 15k ;)"
        ),
      ]);
    }
  }
};

export default GachaHandler;
