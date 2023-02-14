import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { followLeague } from './sport/follow-league';
import { followTeam } from './sport/follow-team';
import { help } from './sport/help';
import { unfollowLeague } from './sport/unfollow-league';
import { unfollowTeam } from './sport/unfollow-team';
import { viewLeagues } from './sport/view-leagues';
import { viewTeams } from './sport/view-teams';

const CMD_NAME = 'sport' as const;

export const sportCmd = new SlashCommandBuilder()
  .setName(CMD_NAME)
  .setDescription('Commande pour les notifications sportives')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('followleague')
      .setDescription('Permet de suivre une ligue')
      .addNumberOption((option) =>
        option
          .setName('leagueid')
          .setDescription("L'identifiant de la ligue")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('followteam')
      .setDescription('Permet de suivre une équipe')
      .addNumberOption((option) =>
        option
          .setName('teamid')
          .setDescription("L'identifiant de l'équipe")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('help')
      .setDescription("Affiche l'aide aux commandes de sport")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('unfollowleague')
      .setDescription('Permet de ne plus suivre une ligue')
      .addNumberOption((option) =>
        option
          .setName('leagueid')
          .setDescription("L'identifiant de la ligue")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('unfollowteam')
      .setDescription('Permet de ne plus suivre une équipe')
      .addNumberOption((option) =>
        option
          .setName('teamid')
          .setDescription("L'identifiant de l'équipe")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('viewleagues')
      .setDescription('Permet de voir la liste des ligues')
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('viewteams')
      .setDescription('Permet de voir la liste des équipes')
      .addNumberOption((option) =>
        option
          .setName('leagueid')
          .setDescription("L'identifiant de la ligue")
          .setRequired(true)
      )
  )
  .toJSON();

export const sportResponse = {
  type: CMD_NAME,
  callback: sportCallback,
};

function sportCallback(interaction: ChatInputCommandInteraction) {
  switch (interaction.options.getSubcommand(true)) {
    case 'followleague':
      return followLeague(interaction);
    case 'followteam':
      return followTeam(interaction);
    case 'help':
      return help(interaction);
    case 'unfollowleague':
      return unfollowLeague(interaction);
    case 'unfollowteam':
      return unfollowTeam(interaction);
    case 'viewleagues':
      return viewLeagues(interaction);
    case 'viewteams':
      return viewTeams(interaction);
    default:
      return Promise.resolve();
  }
}
