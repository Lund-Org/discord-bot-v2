import { TRPCError } from '@trpc/server';
import { Context, t } from './trpc';
import { TServer } from './types';

export const getAuthedProcedure = (t: TServer) =>
  t.procedure.use(async (opts) => {
    const ctx: Context = opts.ctx;

    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return opts.next({
      ctx: {
        // ✅ session value is known to be non-null now
        session: ctx.session,
      },
    });
  });
