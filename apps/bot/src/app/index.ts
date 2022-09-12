import { Client, Message, MessageReaction, Partials, User } from 'discord.js';
import CreateHandlerClasses from './handlers/createHandlers';
import UpdateHandlerClasses from './handlers/updateHandlers';
import { commandsResponses, menusCallback } from './commands';
import { Handler } from './handlers/Handler';
import { initCommands } from './commands/initializer';
import { manageGachaPagination } from './helpers/discordEvent';
import initializers from './initializers';
import { prisma } from '@discord-bot-v2/prisma';

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

    client.on('ready', () => {
      console.log(`Logged in as ${client.user?.tag} !`);
      initializers.forEach((initializer: (client: Client) => void) =>
        initializer(client)
      );
    });

    client.on('messageCreate', async (msg: Message) => {
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

    client.on('messageUpdate', async (msg: Message) => {
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

    client.on('messageReactionAdd', async (reaction, user) => {
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
          user as User
        );
      }
    });

    client.on('interactionCreate', async (interaction) => {
      if (interaction.isChatInputCommand()) {
        for (const cmdCallback of commandsResponses) {
          if (interaction.commandName === cmdCallback.type) {
            await cmdCallback.callback(interaction);
            return;
          }
        }
      }
      if (interaction.isSelectMenu()) {
        for (const menuCallback of menusCallback) {
          await menuCallback(interaction);
        }
      }
    });

    return client.login(process.env.BOT_TOKEN).then(() => client);
  });
};
