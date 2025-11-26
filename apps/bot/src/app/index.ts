import { Game, getGames } from '@discord-bot-v2/igdb';
import { prisma } from '@discord-bot-v2/prisma';
import { BacklogItem, BacklogStatus, User as DBUser } from '@prisma/client';
import {
  Client,
  Collection,
  Events,
  Guild,
  GuildBasedChannel,
  Message,
  MessageReaction,
  OmitPartialGroupDMChannel,
  PartialMessage,
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
          username: discordMember.user.globalName,
          discordId: discordMember.user.id,
        },
        update: {
          username: discordMember.user.globalName,
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

    client.on(Events.UserUpdate, async (user) => {
      await prisma.user.update({
        data: {
          username: user.globalName,
        },
        where: { discordId: user.id },
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

    client.on(
      Events.MessageUpdate,
      async (
        oldMessage: OmitPartialGroupDMChannel<Message | PartialMessage>,
        newMessage: OmitPartialGroupDMChannel<Message>,
      ) => {
        for (const handler of updateHandlers) {
          const validation = await handler.validate(client, newMessage);

          if (validation) {
            try {
              const result = await handler.process(client, newMessage);
              if (result) {
                break;
              }
            } catch (e) {
              console.error(e);
            }
          }
        }
      },
    );

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

    // To delete once import is done
    client.on(Events.ClientReady, async () => {
      const servers: Collection<string, Guild> = client.guilds.cache;

      await processServer(servers.at(0));
    });

    return client.login(process.env.BOT_TOKEN).then(() => client);
  });
};

async function processServer(server: Guild) {
  const backlogChannelId = '312267835151876096';
  const batchSize = 100;
  const operations: Array<{
    game: Game;
    backlogItem: BacklogItem & { user: DBUser };
    status: BacklogStatus;
    ts: number;
  }> = [];

  const webhookChannel = server.channels.cache.find(
    (channel: GuildBasedChannel) => {
      return channel.id === backlogChannelId;
    },
  );

  if (!webhookChannel || !webhookChannel.isTextBased()) {
    console.warn('Channel not found');
    return;
  }

  let lastId: string | null = null;
  let list: Collection<string, Message<true>> | null = null;

  do {
    console.log('Start fetching !');
    list = await webhookChannel.messages.fetch({
      before: lastId || undefined,
      limit: batchSize,
    });

    for (const message of list.values()) {
      if (isBacklogMsg(message)) {
        const { title, status, discordId } = getBacklogFields(message);

        if (title && status && discordId) {
          const user = await prisma.user.findUnique({
            where: { discordId },
            include: { backlogItems: { include: { user: true } } },
          });
          const games = await getGames(title.value, []);

          const { backlogItem, game } = getMatchingGame(user, games);

          if (backlogItem && game) {
            operations.push({
              backlogItem,
              game,
              status,
              ts: message.createdTimestamp,
            });
          } else {
            console.warn(
              `Game not found - ${title.value} for user ${discordId}`,
            );
          }
        } else {
          console.warn('Not a backlog status change or not matching anything');
        }
      }
    }

    lastId = list.last().id;
  } while (list.size === batchSize);

  await applyDBOperations(operations.reverse());

  console.log('FINISHED !');
}

function isBacklogMsg(message: Message) {
  const backlogBot = '1067149641839300659';

  return (
    message.author.id === backlogBot &&
    message.embeds[0]?.title === 'Mise à jour du backlog'
  );
}

function getBacklogFields(message: Message) {
  const wordingMapping = {
    'a abandonné le jeu': BacklogStatus.ABANDONED,
    'a fini le jeu': BacklogStatus.FINISHED,
    'a remis le jeu dans son backlog': BacklogStatus.BACKLOG,
    'a commencé le jeu': BacklogStatus.CURRENTLY,
  };

  const title = message.embeds[0]?.fields.find(({ name }) => name === 'Titre');
  const status = message.embeds[0]?.fields.find(
    ({ name }) => name === 'Statut',
  );
  const url = message.embeds[0]?.fields.find(
    ({ name }) => name === 'URL du profil',
  );

  const urlMatch = url?.value.match(/\/u\/([A-Za-z0-9]+)/);
  const statusValue = status
    ? wordingMapping[status.value.toLowerCase()]
    : null;

  return {
    title,
    status: statusValue,
    discordId: urlMatch && urlMatch[1] ? urlMatch[1] : null,
  };
}

function getMatchingGame(
  user: (DBUser & { backlogItems: (BacklogItem & { user: DBUser })[] }) | null,
  games: Game[],
) {
  const gameIndex = games.findIndex(({ id }) => {
    return user?.backlogItems.find(({ igdbGameId }) => id === igdbGameId);
  });
  const backlogItemIndex =
    gameIndex === -1
      ? null
      : user?.backlogItems.findIndex(
          ({ igdbGameId }) => games[gameIndex].id === igdbGameId,
        );

  return {
    game: gameIndex === -1 ? null : games[gameIndex],
    gameIndex,
    backlogItem:
      backlogItemIndex === -1 ? null : user.backlogItems[backlogItemIndex],
    backlogItemIndex,
  };
}

async function applyDBOperations(
  operations: Array<{
    game: Game;
    backlogItem: BacklogItem & { user: DBUser };
    status: BacklogStatus;
    ts: number;
  }>,
) {
  for (const operation of operations) {
    switch (operation.status) {
      case BacklogStatus.BACKLOG: {
        await prisma.backlogItem.update({
          where: { id: operation.backlogItem.id },
          data: {
            startedAt: null,
            finishedAt: null,
            abandonedAt: null,
            wishlistAt: null,
            createdAt: new Date(operation.ts),
          },
        });
        break;
      }
      case BacklogStatus.ABANDONED: {
        await prisma.backlogItem.update({
          where: { id: operation.backlogItem.id },
          data: {
            finishedAt: null,
            abandonedAt: new Date(operation.ts),
          },
        });
        break;
      }
      case BacklogStatus.CURRENTLY: {
        await prisma.backlogItem.update({
          where: { id: operation.backlogItem.id },
          data: {
            finishedAt: null,
            abandonedAt: null,
            startedAt: new Date(operation.ts),
          },
        });
        break;
      }
      case BacklogStatus.FINISHED: {
        await prisma.backlogItem.update({
          where: { id: operation.backlogItem.id },
          data: {
            finishedAt: new Date(operation.ts),
            abandonedAt: null,
          },
        });
        break;
      }
    }
  }
}
