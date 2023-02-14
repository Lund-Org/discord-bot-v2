import { prisma } from '@discord-bot-v2/prisma';
import NextAuth, { AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

export const authOptions: AuthOptions = {
  theme: {
    colorScheme: 'dark',
  },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_OAUTH_CLIENT_ID,
      clientSecret: process.env.DISCORD_OAUTH_SECRET_ID,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const dbUser = await prisma.user.findUnique({
        where: {
          discordId: user.id,
        },
      });
      if (dbUser) {
        await prisma.user.update({
          where: {
            discordId: user.id,
          },
          data: {
            username: user.name,
          },
        });
      }

      return !!dbUser;
    },
    async jwt({ token, account, user, profile }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token, user }) {
      // To not display the email in the network, since it's not used
      delete session.user.email;

      const dbUser = await prisma.user.getPlayer(token.userId);

      session.userId = token.userId;
      session.isPlayer = !!dbUser?.player;
      return session;
    },
  },
};
export default NextAuth(authOptions);
