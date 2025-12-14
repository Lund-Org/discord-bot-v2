import { createNextApiHandler } from '@trpc/server/adapters/next';

import { AppRouter, appRouter, createContext } from '../../../server/trpc';

export default createNextApiHandler<AppRouter>({
  router: appRouter,
  createContext,
});
