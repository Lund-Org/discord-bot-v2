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
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const dbUser = await prisma.player.findUnique({
        where: {
          discordId: user.id,
        },
      });
      if (dbUser) {
        await prisma.player.update({
          where: {
            discordId: user.id,
          },
          data: {
            username: user.name,
            // update avatar in DB (to add) (user.image)
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

      session.userId = token.userId;
      return session;
    },
  },
};
export default NextAuth(authOptions);
