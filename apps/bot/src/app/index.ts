import { prisma } from '@discord-bot-v2/prisma';
import {
  Client,
  Events,
  Message,
  MessageReaction,
  Partials,
  User,
} from 'discord.js';

import { buttonsCallback, commandsResponses, menusCallback } from './commands';
import { initCommands } from './commands/initializer';
import CreateHandlerClasses from './handlers/createHandlers';
import { Handler } from './handlers/Handler';
import UpdateHandlerClasses from './handlers/updateHandlers';
import { manageGachaPagination } from './helpers/discordEvent';
import initializers from './initializers';

export const startBot = (): Promise<Client> => {
  return initCommands().then(() => {
    const client = new Client({
      partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.GuildMember,
        Partials.User,
      ],
      intents: [
        'Guilds',
        'GuildMembers',
        'GuildEmojisAndStickers',
        'GuildMessages',
        'GuildMessageReactions',
        'GuildScheduledEvents',
        'MessageContent',
      ],
    });
    const createHandlers = CreateHandlerClasses.map((HandlerClass): Handler => {
      return new HandlerClass();
    });
    const updateHandlers = UpdateHandlerClasses.map((HandlerClass): Handler => {
      return new HandlerClass();
    });

    client.on(Events.ClientReady, () => {
      console.log(`Logged in as ${client.user?.tag} !`);
      initializers.forEach((initializer: (client: Client) => void) =>
        initializer(client),
      );
    });

    client.on(Events.GuildMemberAdd, async (discordMember) => {
      await prisma.user.upsert({
        create: {
          username: discordMember.user.username,
          discordId: discordMember.user.id,
        },
        update: {
          username: discordMember.user.username,
          isActive: true,
        },
        where: { discordId: discordMember.user.id },
      });
    });

    client.on(Events.GuildMemberRemove, async (discordMember) => {
      await prisma.user.update({
        data: {
          isActive: false,
        },
        where: { discordId: discordMember.user.id },
      });
    });

    client.on(Events.MessageCreate, async (msg: Message) => {
      for (const handler of createHandlers) {
        const validation = await handler.validate(client, msg);

        if (validation) {
          try {
            const result = await handler.process(client, msg);
            if (result) {
              break;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    });

    client.on(Events.MessageUpdate, async (msg: Message) => {
      for (const handler of updateHandlers) {
        const validation = await handler.validate(client, msg);

        if (validation) {
          try {
            const result = await handler.process(client, msg);
            if (result) {
              break;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    });

    client.on(Events.MessageReactionAdd, async (reaction, user) => {
      let fullReaction: MessageReaction;

      // When we receive a reaction we check if the reaction is partial or not
      try {
        if (reaction.partial) {
          fullReaction = await reaction.fetch();
        } else {
          fullReaction = reaction as MessageReaction;
        }
        if (user.partial) {
          await user.fetch();
        }
      } catch (error) {
        console.error(error);
        return;
      }

      const matchingPagination = await prisma.pagination.findFirst({
        where: {
          discordUserId: user.id,
          discordMessageId: fullReaction.message.id,
        },
      });

      if (matchingPagination) {
        await manageGachaPagination(
          matchingPagination,
          fullReaction,
          user as User,
        );
      }
    });

    client.on(Events.InteractionCreate, async (interaction) => {
      if (interaction.isChatInputCommand()) {
        for (const cmdCallback of commandsResponses) {
          if (interaction.commandName === cmdCallback.type) {
            await cmdCallback.callback(interaction);
            return;
          }
        }
      }
      if (interaction.isStringSelectMenu()) {
        for (const menuCallback of menusCallback) {
          await menuCallback(interaction);
        }
      }
      if (interaction.isButton()) {
        for (const buttonCallback of buttonsCallback) {
          await buttonCallback(interaction);
        }
      }
    });

    return client.login(process.env.BOT_TOKEN).then(() => client);
  });
};
