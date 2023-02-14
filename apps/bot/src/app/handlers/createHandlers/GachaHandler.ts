import { Client, Message } from 'discord.js';
import { Handler } from '../Handler';
import { prisma } from '@discord-bot-v2/prisma';
import { invalidateWebsitePages } from '../../helpers/discordEvent';

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
  }
};

export default GachaHandler;
