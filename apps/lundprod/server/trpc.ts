import { initTRPC } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { z } from 'zod';
import { getGamesRouter } from './games';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { getProfilesRouter } from './profile';

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getServerSession(opts.req, opts.res, authOptions);

  return {
    session,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
export const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  hello: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { message: `Hello, ${input.name}!` };
    }),
  ...getProfilesRouter(t),
  ...getGamesRouter(t),
});
export type AppRouter = typeof appRouter;
