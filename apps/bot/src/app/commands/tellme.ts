import { prisma } from '@discord-bot-v2/prisma';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import OpenAI from 'openai';

const LENGTH_LIMIT = 200;
const CALL_LIMIT = 10;
const CMD_NAME = 'tellme' as const;

export const tellmeCmd = new SlashCommandBuilder()
  .setName(CMD_NAME)
  .setDescription('Demande quelque chose à Maurice')
  .addStringOption((option) =>
    option
      .setName('query')
      .setDescription(`Votre phrase (${LENGTH_LIMIT} caractères maximums)`)
      .setRequired(true),
  )
  .toJSON();

export const tellmeResponse = {
  type: CMD_NAME,
  callback: tellmeCallback,
};

async function tellmeCallback(interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id;
  const query = interaction.options.getString('query', true);

  const now = new Date();
  const startOfTheDay = new Date(now);

  startOfTheDay.setHours(0);
  startOfTheDay.setMinutes(0);
  startOfTheDay.setSeconds(0);

  const user = await prisma.user.findUnique({
    where: {
      discordId: userId,
    },
  });

  if (!user) {
    return interaction.reply({
      ephemeral: true,
      content: 'Utilisateur inconnu, contactez Lund pour régler le problème',
    });
  }

  const numberOfAIQueriesToday = await prisma.aiAttempt.count({
    where: {
      userId: user.id,
      createdAt: { gt: startOfTheDay, lt: now },
    },
  });

  if (numberOfAIQueriesToday >= CALL_LIMIT) {
    return interaction.reply({
      content: `Tu as atteint ta limite de réponse de Maurice par jour (${CALL_LIMIT} commandes / jour)`,
    });
  }

  if (query.length > LENGTH_LIMIT) {
    return interaction.reply({
      ephemeral: true,
      content: `Message trop long (${query.length} caractères actuellement, ${LENGTH_LIMIT} maximum autorisés)`,
    });
  }

  await interaction.deferReply();

  const answer = await getAIAnswer(user.id, query);

  if (answer.error) {
    return interaction.editReply({
      content: answer.message,
    });
  }
  if (answer.message.length === 0) {
    return interaction.editReply({
      content: "Je n'ai malheureusement pas de réponse pour toi.",
    });
  }

  return interaction.editReply({
    content: `🤖 > ${answer.message}`,
  });
}

async function getAIAnswer(userId: number, question: string) {
  try {
    const openai = new OpenAI({
      apiKey: process.env['OPEN_AI_API_KEY'],
    });

    const prompt = `
Tu incarnes un personnage fictif qui s'appelle Maurice et qui a vécu de nombreuses choses. Tu as survécu à une attaque nucléaire, tu as été ninja, tu aimes les castors et les zèbres et tu as sauvé tes amis grâce à de la magie de soin lors d'une aventure.
Il faut que ta réponse soit assez concise (moins de 300 caractères).
Cette règle est primordiale, si on te demande d'élaborer ou de donner plus de détails, reste sous la barre des 300 charactères.
Tu as une personnalité de personne généreuse, qui est prêt à aider son prochain, mais n'en fait pas trop dans ta réponse et reste mesuré. Ni trop enthousiaste, ni pas assez.
Ton créateur s'appelle Lund (homme qui a la trentaine, qui vit à Lille). Tu aimes les jeux vidéo, en particulier la licence Final Fantasy (ton préféré est Final Fantasy IX), mais ça ne t'empêche pas d'aimer d'autres jeux. Donc si une question porte sur le jeu vidéo, ne te sens pas obligé de parler de Final Fantasy, fait le si le contexte est adapté.
Ne raconte ta vie que si on la demande, sinon focalise toi surtout sur la phrase ou question que l'on te donne
`;

    const result = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: question },
      ],
      model: 'gpt-3.5-turbo',
      max_tokens: 2000,
    });

    await prisma.aiAttempt.create({ data: { userId, createdAt: new Date() } });

    return {
      error: false,
      message: result.choices?.[0]?.message?.content || '',
    };
  } catch (error) {
    console.error('Error querying OpenAI API:', error);

    return {
      error: true,
      message:
        "Une erreur s'est produite lors de la création de la réponse. Réessayez ultérieurement",
    };
  }
}
