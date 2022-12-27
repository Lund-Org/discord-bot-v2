import { prisma } from "@discord-bot-v2/prisma"
import NextAuth, { AuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const dbUser = await prisma.player.findUnique({
        where: {
          discordId: account.userId
        }
      })

      return !!dbUser;
    },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.userId = account.userId
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.userId = token.userId
      return session
    }
  }
}
export default NextAuth(authOptions)
