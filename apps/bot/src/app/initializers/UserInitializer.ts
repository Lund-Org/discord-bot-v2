import { prisma } from '@discord-bot-v2/prisma';
import { Client } from 'discord.js';

export async function UserInitializer(client: Client) {
  const servers = await client.guilds.fetch();

  for (const server of servers.values()) {
    const guild = await server.fetch();
    const discordMembers = await guild.members.fetch();

    discordMembers.forEach(async (discordMember) => {
      if (discordMember.user.bot) {
        return;
      }

      await prisma.user.upsert({
        create: {
          username: discordMember.user.globalName,
          discordId: discordMember.user.id,
        },
        update: {
          username: discordMember.user.globalName,
        },
        where: { discordId: discordMember.user.id },
      });
    });
  }

  return true;
}
